const fs = require('fs');

function encodeUtf8(str) {
  const utf8 = [];
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char.charCodeAt(0) < 128) {
      // ASCII characters are a single byte in UTF-8, directly added
      utf8.push(char.charCodeAt(0));
    } else {
      // Encode non-ASCII characters to UTF-8 bytes
      const encodedChar = encodeURIComponent(char);
      const bytes = encodedChar.split('%').slice(1).map(hex => parseInt(hex, 16));
      utf8.push(...bytes);
    }
  }
  return utf8;
}

class CodeGenTokenizer {
  constructor(vocabFile, mergesFile) {
    this.encoder = JSON.parse(fs.readFileSync(vocabFile, 'utf-8'));
    this.decoder = Object.fromEntries(Object.entries(this.encoder).map(([k, v]) => [v, k]));
    this.errors = 'replace';
    this.byteEncoder = this.bytesToUnicode();
    this.byteDecoder = Object.fromEntries(Object.entries(this.byteEncoder).map(([k, v]) => [v, k]));
    this.bpeRanks = this.loadBpeRanks(mergesFile);
    this.cache = {};
    this.pat = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;
  }

  bytesToUnicode() {
    const bs = Array.from({ length: 256 }, (_, i) => i)
      .filter((b) => b >= 33 && b <= 126 || b >= 161 && b <= 172 || b >= 174 && b <= 255);
    const cs = bs.slice();
    let n = 0;
    for (let b = 0; b < 2 ** 8; b++) {
      if (!bs.includes(b)) {
        bs.push(b);
        cs.push(2 ** 8 + n);
        n++;
      }
    }
    return Object.fromEntries(bs.map((b, i) => [b, String.fromCharCode(cs[i])]));
  }

  getPairs(word) {
    const pairs = new Set();
    let prevChar = word[0];
    for (let i = 1; i < word.length; i++) {
      const char = word[i];
      pairs.add([prevChar, char]);
      prevChar = char;
    }
    return pairs;
  }

  bpe(token) {
    if (token in this.cache) {
      return this.cache[token];
    }
    let word = Array.from(token);
    let pairs = this.getPairs(word);


    if (!pairs.size) {
      return token;
    }

    while (true) {
      const minPair = Array.from(pairs).reduce((a, b) => {
        const aStr = JSON.stringify(a);
        const bStr = JSON.stringify(b);
        return this.bpeRanks[aStr] !== undefined && (this.bpeRanks[bStr] === undefined || this.bpeRanks[aStr] < this.bpeRanks[bStr]) ? a : b
      });

      // console.log("this.bpeRanks", this.bpeRanks);

      if (!(JSON.stringify(minPair) in this.bpeRanks)) {
        break;
      }
      const [first, second] = minPair;
      let newWord = [];
      let i = 0;
      while (i < word.length) {
        const j = word.indexOf(first, i);
        if (j === -1) {
          newWord.push(...word.slice(i));
          break;
        } else {
          newWord.push(...word.slice(i, j));
          i = j;
        }
        if (word[i] === first && i < word.length - 1 && word[i + 1] === second) {
          newWord.push(first + second);
          i += 2;
        } else {
          newWord.push(word[i]);
          i += 1;
        }
      }
      word = newWord;
      if (word.length === 1) {
        break;
      } else {
        pairs = this.getPairs(word);
      }
    }
    const result = word.join(' ');
    this.cache[token] = result;
    return result;
  }

  loadBpeRanks(mergesFile) {
    let bpeMerges = fs.readFileSync(mergesFile, 'utf-8').split('\n').slice(1, -1);
    bpeMerges = bpeMerges.map((merge) => merge.split(' '));
    const bpeRanks = {}
    for (let i = 0; i < bpeMerges.length; i++) {
      bpeRanks[JSON.stringify(bpeMerges[i])] = i
    }
    return bpeRanks;
  }

  tokenize(text) {
    let bpeTokens = [];
    for (const match of text.matchAll(this.pat)) {
      const token = match[0];
      const bytes = encodeUtf8(token);
      const encodedToken = bytes.map((b) => this.byteEncoder[b] || '').join('');
      const bpeTokensForToken = this.bpe(encodedToken).split(' ');
      bpeTokens.push(...bpeTokensForToken);
    }
    return bpeTokens;
  }

  encode(text) {
    const tokens = this.tokenize(text);
    return tokens.map((token) => this.encoder[token] || this.encoder[this.unkToken]);
  }

  decode(tokenIds) {
    const tokens = tokenIds.map((tokenId) => this.decoder[tokenId] || this.unkToken);
    const decodedText = tokens.map((token) => this.byteDecoder[token] || token).join('');
    return decodedText;
  }
}

// Example usage
const vocabFile = 'vocab.json';
const mergesFile = 'merges.txt';

const tokenizer = new CodeGenTokenizer(vocabFile, mergesFile);

// const text = "Hi, how are you?";
const text = 'ス'
const tokens = tokenizer.tokenize(text);
console.log('Tokenized:', tokens);

// const tokenIds = tokenizer.encode(text);
// console.log('Token IDs:', tokenIds);
//
// const decodedText = tokenizer.decode(tokenIds);
// console.log('Decoded Text:', decodedText);


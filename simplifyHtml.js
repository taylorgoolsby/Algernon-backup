const htmlparser2 = require('htmlparser2');
const { DomHandler, DomUtils } = require('htmlparser2');
const render = require('dom-serializer').default;
const sanitizeHtml = require('sanitize-html');

const htmlContent = `<!DOCTYPE html>
<html lang=\\"en-us\\" class=\\"accuweather\\">

<head>
\t<meta http-equiv=\\"X-UA-Compatible\\" content=\\"IE=edge,chrome=1\\">
\t
\t<meta charset=\\"utf-8\\" />
\t<link rel=\\"canonical\\" href=\\"https://www.accuweather.com/en/us/marina/93933/current-weather/337145\\" />
\t<title>Marina, CA Current Weather | AccuWeather</title>
\t<meta name=\\"Description\\" content=\\"Current weather in Marina, CA. Check current conditions in Marina, CA with radar, hourly, and more.\\">
\t<meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\" />
\t<meta name=\\"referrer\\" content=\\"origin\\">
\t
\t

\t<meta property=\\"fb:profile_id\\" content=\\"AccuWeather\\">
<meta property=\\"fb:app_id\\" content=\\"132437483467956\\">
<meta property=\\"fb:pages\\" content=\\"71781612888\\">
<meta property=\\"og:type\\" content=\\"website\\">
<meta property=\\"og:title\\" content=\\"Marina, CA Current Weather | AccuWeather\\">
<meta property=\\"og:description\\" content=\\"Current weather in Marina, CA. Check current conditions in Marina, CA with radar, hourly, and more.\\">
<meta property=\\"site_name\\" content=\\"AccuWeather\\">
<meta property=\\"og:url\\" content=\\"https://www.accuweather.com/en/us/marina/93933/current-weather/337145\\">
<meta property=\\"og:image\\" content=\\"https://www.accuweather.com/images/logos/aw-logo-og-meta.png\\">
<meta property=\\"og:image:url\\" content=\\"https://www.accuweather.com/images/logos/aw-logo-og-meta.png\\">
<meta property=\\"og:image:secure_url\\" content=\\"https://www.accuweather.com/images/logos/aw-logo-og-meta.png\\">
<meta name=\\"twitter:site\\" content=\\"https://twitter.com/accuweather\\" >
<meta name=\\"twitter:card\\" content=\\"summary\\">
<meta name=\\"twitter:text:title\\" content=\\"Marina, CA Current Weather | AccuWeather\\">
<meta name=\\"twitter:title\\" content=\\"Marina, CA Current Weather | AccuWeather\\">
<meta name=\\"twitter:description\\" content=\\"Current weather in Marina, CA. Check current conditions in Marina, CA with radar, hourly, and more.\\">
<meta name=\\"twitter:site:id\\" content=\\"https://twitter.com/accuweather\\">
<meta name=\\"twitter:creator\\" content=\\"https://twitter.com/accuweather\\">
<meta name=\\"twitter:creator:id\\" content=\\"https://twitter.com/accuweather\\">
<meta name=\\"twitter:image\\" content=\\"https://www.accuweather.com/images/logos/aw-logo-og-meta.png\\">
<meta name=\\"twitter:app:name:iphone\\" content=\\"AccuWeather: Weather Tracker\\">
<meta name=\\"twitter:app:id:iphone\\" content=\\"U7D6TVQ9TT.com.yourcompany.TestWithCustomTabs\\">
<meta name=\\"twitter:app:url:iphone\\" content=\\"https://apps.apple.com/US/app/id300048137?mt=8\\">
<meta name=\\"twitter:app:name:ipad\\" content=\\"AccuWeather: Weather Tracker\\">
<meta name=\\"twitter:app:id:ipad\\" content=\\"U7D6TVQ9TT.com.yourcompany.TestWithCustomTabs\\">
<meta name=\\"twitter:app:url:ipad\\" content=\\"https://apps.apple.com/US/app/id300048137?mt=8\\">
<meta name=\\"twitter:app:name:googleplay\\" content=\\"AccuWeather Winter weather alerts & forecast radar\\">
<meta name=\\"twitter:app:id:googleplay\\" content=\\"com.accuweather.android\\">
<meta name=\\"twitter:app:url:googleplay\\" content=\\"https://play.google.com/store/apps/details?id=com.accuweather.android\\">

\t<script type=\\"application/ld+json\\">
{
\t\\"@context\\": \\"https://schema.org\\",
\t\\"@type\\": \\"Organization\\",
\t\\"name\\": \\"AccuWeather\\",
\t\\"url\\": \\"https://www.accuweather.com\\",
\t\\"sameAs\\": [
\t\t\\"https://www.facebook.com/AccuWeather\\",
\t\t\\"https://twitter.com/BreakingWeather\\",
\t\t\\"https://www.instagram.com/accuweather\\",
\t\t\\"https://www.youtube.com/user/accuweather\\"
  ]
}
</script>

\t\t<script type=\\"application/ld+json\\">
\t{
\t\t\\"@context\\": \\"https://schema.org\\",
\t\t\\"@type\\": \\"Place\\",
\t\t\\"address\\": {
\t\t\t\\"@type\\": \\"PostalAddress\\",
\t\t\t\\"addressLocality\\": \\"Marina, United States\\",
\t\t\t\\"addressRegion\\": \\"California\\",
\t\t\t\\"postalCode\\": \\"93933\\"
\t\t},
\t\t\\"geo\\": {
\t\t\t\\"@type\\": \\"GeoCoordinates\\",
\t\t\t\\"latitude\\": \\"36.684\\",
\t\t\t\\"longitude\\": \\"-121.802\\",
\t\t\t\\"addressCountry\\": \\"US\\",
\t\t\t\\"postalCode\\": \\"93933\\"
\t\t},
\t\t\\"name\\": \\"Marina, California, United States\\"
\t}
\t</script>

\t<script type=\\"application/ld+json\\">
{
\t\\"@context\\": \\"https://schema.org\\",
\t\\"@type\\": \\"WebSite\\",
\t\\"mainEntityOfPage\\": {
\t\t\\"@type\\": \\"WebPage\\",
\t\t\\"@id\\": \\"https://www.accuweather.com/en/us/marina/93933/current-weather/337145\\",
\t\t\\"relatedLink\\": \\"https://www.accuweather.com/en/us/marina/93933/current-weather/337145\\"
\t},
\t\\"image\\": {
\t\t\\"@type\\": \\"ImageObject\\",
\t\t\\"url\\": \\"https://www.accuweather.com/images/logos/accuweather-dark.png\\",
\t\t\\"height\\": 172,
\t\t\\"width\\": 1200
\t},
\t\\"author\\": {
\t\t\\"@type\\": \\"Person\\",
\t\t\\"name\\": \\"AccuWeather\\"
\t},
\t\\"publisher\\": {
\t\t\\"@context\\": \\"https://schema.org\\",
\t\t\\"@type\\": \\"Organization\\",
\t\t\\"name\\": \\"AccuWeather\\",
\t\t\\"url\\": \\"https://www.accuweather.com/\\",
\t\t\\"logo\\": {
\t\t\t\\"@type\\": \\"ImageObject\\",
\t\t\t\\"url\\": \\"https://www.accuweather.com/images/logos/accuweather-dark-small.png\\",
\t\t\t\\"width\\": 163,
\t\t\t\\"height\\": 23
\t\t}
\t},
\t\\"url\\": \\"https://www.accuweather.com/en/us/marina/93933/current-weather/337145\\",
\t\\"headline\\": \\"Marina, CA Current Weather\\",
\t\\"description\\": \\"Current weather in Marina, CA. Check current conditions in Marina, CA with radar, hourly, and more.\\"
}
</script>


\t<style>
\t\t@font-face {
\t\t\tfont-family: 'Solis';
\t\t\tsrc: url('/fonts/Solis-Regular.woff2') format('woff2');
\t\t\tfont-weight: 400;
\t\t\tfont-style: normal;
\t\t\tfont-display: swap;
\t\t}
\t</style>
\t\t<style>
\t\t\t:root {
\t\t\t\t--bg: #1f1f1f;
\t\t\t\t--header-bg: #1f1f1f;
\t\t\t\t--header-bg-top: #1f1f1f;
\t\t\t}
\t\t</style>

\t

<script>
\t var globalAdConfig = {\\"prebidTimeout\\":1000,\\"awxTimeout\\":1000,\\"ortbSite\\":{\\"categories\\":[\\"IAB3\\",\\"IAB7\\",\\"IAB8\\",\\"IAB10\\",\\"IAB12\\",\\"IAB15\\",\\"IAB17\\",\\"IAB20\\",\\"150\\",\\"210\\",\\"223\\",\\"274\\",\\"286\\",\\"464\\",\\"483\\",\\"552\\",\\"653\\"],\\"content\\":{\\"title\\":\\"\\",\\"url\\":\\"\\",\\"categories\\":[\\"IAB12-3\\",\\"IAB15-10\\",\\"IAB20-8\\",\\"390\\",\\"660\\"],\\"productQuality\\":\\"1\\",\\"context\\":\\"5\\",\\"keywords\\":\\"\\",\\"sourceRelationship\\":1,\\"language\\":\\"\\",\\"data\\":{\\"name\\":\\"accuweather.com\\",\\"extensions\\":{\\"segtax\\":\\"4\\"},\\"segments\\":[{\\"name\\":\\"id\\",\\"value\\":\\"390\\"},{\\"name\\":\\"id\\",\\"value\\":\\"660\\"}]}},\\"domain\\":\\"www.accuweather.com\\",\\"keywords\\":\\"\\",\\"name\\":\\"AccuWeather\\",\\"privacyPolicy\\":1,\\"mobile\\":1,\\"pageCategories\\":[\\"IAB12-3\\",\\"IAB15-10\\",\\"IAB20-8\\",\\"390\\",\\"660\\"],\\"publisher\\":{\\"name\\":\\"AccuWeather\\",\\"domain\\":\\"www.accuweather.com\\",\\"categories\\":[\\"IAB3\\",\\"IAB7\\",\\"IAB8\\",\\"IAB10\\",\\"IAB12\\",\\"IAB15\\",\\"IAB17\\",\\"IAB20\\",\\"150\\",\\"210\\",\\"223\\",\\"274\\",\\"286\\",\\"464\\",\\"483\\",\\"552\\",\\"653\\"]},\\"sectionCategories\\":[\\"\\"]},\\"enableSingleRequest\\":true,\\"lazyLoadingData\\":\\"{}\\",\\"skipGoogleAdManager\\":true,\\"prebidBundleId\\":\\"b\\",\\"testVariant\\":\\"\\",\\"disableInitialAdLoad\\":true,\\"javascriptHead\\":\\"\\",\\"javascriptBody\\":\\"\\"};
\t\t (['segtax']).forEach((key) => {if(globalAdConfig.ortbSite.content.data.extensions?.[key]){ globalAdConfig.ortbSite.content.data.extensions[key] = parseInt(globalAdConfig.ortbSite.content.data.extensions[key]) }})
var isPrebidDisabled = false;
var adExclusion = null;
var botDetected = 0;
var adInfo = {\\"fdate\\":\\"20240723\\",\\"lang\\":\\"en-us\\",\\"ut\\":\\"0\\",\\"advelvet\\":\\"18\\",\\"bot\\":\\"0\\",\\"pgview\\":\\"5\\",\\"partner\\":\\"accuweather\\",\\"ufdb\\":\\"MARI\\",\\"city\\":\\"Marina\\",\\"country\\":\\"US\\",\\"state\\":\\"CA\\",\\"dma\\":\\"828\\",\\"key\\":\\"337145\\",\\"zip\\":\\"939XX\\",\\"browser\\":\\"cfnetwork app\\",\\"connection\\":\\"cable_vhigh_5000\\",\\"wx_seg\\":\\"108105100,101103100,109101100,108103102,100108101,102102100,110100100,102101100,108102100,101108100,100106104,103101104,999100000,101100100,102100100,108104101,102103100,102104100,101107100,101105100,101104101,101106101,100109107,101101104,100109104,109100104,105100104,101102100,107100104,109104102,108100104,109102104,109106104,100111101,103100104,107101104,108101104,100113102,109105102,110102101,109103104,104100104,104101104,100112103\\",\\"cuhd\\":\\"88\\",\\"cuhi\\":\\"61\\",\\"cuuv\\":\\"5\\",\\"cuwd\\":\\"9\\",\\"cuwx\\":\\"1\\",\\"realfeel\\":\\"60,a70\\",\\"fc1hi\\":\\"60\\",\\"fc1lo\\":\\"57\\",\\"fc1wx\\":\\"2\\",\\"lfscategory\\":\\"fog\\",\\"lfsday\\":\\"3\\",\\"lfsseverity\\":\\"5\\",\\"lfs\\":\\"5_fog_3\\",\\"pt\\":\\"0\\",\\"userid\\":\\"active\\",\\"userid3p\\":\\"active\\",\\"iabctax\\":\\"IAB12-3,IAB15-10,IAB20-8,390,660\\"};

// page views
var awPageViewName = 'awx_pv';
var pageViewItem = JSON.parse(window.localStorage.getItem(awPageViewName));
if (!pageViewItem) {
\tpageViewItem = {val: 1}
}
var currentTime = new Date();
var midnight = new Date();
var pageViewCount = 1;
midnight.setDate(midnight.getDate() + 1);
midnight.setHours(0, 0, 0, 0);
if (currentTime < pageViewItem.ttl) {
\tpageViewCount = parseInt(pageViewItem.val ?? 0) + 1;
}
window.adInfo = window.adInfo || {};
window.adInfo.pgview = pageViewCount.toString();
window.localStorage.setItem(awPageViewName, JSON.stringify({
\tval: pageViewCount,
\tttl: Date.now() + Math.abs(midnight.getTime() - currentTime.getTime())
}));

var adPageInfo = {category:'weather',template:'current'};
var partnerCode = 'accuweather';
var countryCode = 'us';
var networkType = 'cable';
var throughput = 'vhigh';
</script>


\t<script>
\t\tvar serverAdsOnPageLite = {\\"top\\":{\\"config\\":{\\"responsiveSizes\\":[{\\"window\\":[1024,0],\\"sizes\\":[\\"fluid\\",[980,120],[980,90],[970,250],[970,90],[950,90],[930,180],[750,100],[750,300],[750,200],[728,90]]},{\\"window\\":[768,0],\\"sizes\\":[\\"fluid\\",[728,90],[468,60],[320,50],[300,50]]},{\\"window\\":[0,0],\\"sizes\\":[[320,100],[320,50],[300,250],[300,100],[300,50],[250,360],[240,400]]}],\\"bids\\":[{\\"bidder\\":\\"google\\",\\"params\\":{\\"sizes\\":\\"970x250,728x90,fluid\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"appnexus\\",\\"params\\":{\\"placementId\\":29838031,\\"allowSmallerSizes\\":\\"FALSE\\",\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/top/weather/current\\"]},\\"reserve\\":1.8,\\"position\\":\\"above\\",\\"supplyType\\":\\"web\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"rubicon\\",\\"params\\":{\\"accountId\\":12562,\\"siteId\\":135890,\\"zoneId\\":2841914,\\"position\\":\\"atf\\",\\"userId\\":\\"b292ff24a7bf4fffb9b5ee4da18c7328\\",\\"floor\\":1.8,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"triplelift\\",\\"params\\":{\\"inventoryCode\\":\\"Acccuweather_Prebid_web_top_highperformance_970x250\\",\\"floor\\":1.8,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"pubmatic\\",\\"params\\":{\\"publisherId\\":\\"34576\\",\\"adSlot\\":\\"Web_Top\\",\\"lat\\":\\"36.68\\",\\"lon\\":\\"-121.8\\",\\"kadfloor\\":\\"1.80\\",\\"currency\\":\\"USD\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"grid\\",\\"params\\":{\\"uid\\":6028,\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/top/weather/current\\"]},\\"bidFloor\\":1.8,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"yahoossp\\",\\"params\\":{\\"dcn\\":\\"8a9691d3017474551cc955a9acbd0027\\",\\"pos\\":\\"web_hb_top_1\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"ix\\",\\"params\\":{\\"siteId\\":\\"974818\\",\\"bidFloor\\":1.8,\\"bidFloorCur\\":\\"USD\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"openx\\",\\"params\\":{\\"delDomain\\":\\"accuweather-d.openx.net\\",\\"unit\\":\\"539580665\\",\\"customParams\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/top/weather/current\\"]},\\"customFloor\\":1.8,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"ttd\\",\\"params\\":{\\"supplySourceId\\":\\"accuweather\\",\\"publisherId\\":\\"1\\",\\"bidfloor\\":3.75,\\"currency\\":\\"USD\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"google\\",\\"params\\":{\\"sizes\\":\\"970x250,728x90,fluid\\",\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"appnexus\\",\\"params\\":{\\"placementId\\":18044795,\\"allowSmallerSizes\\":\\"FALSE\\",\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/top/weather/current\\"]},\\"reserve\\":6.25,\\"position\\":\\"above\\",\\"supplyType\\":\\"web\\",\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"rubicon\\",\\"params\\":{\\"accountId\\":12562,\\"siteId\\":135890,\\"zoneId\\":1518598,\\"position\\":\\"atf\\",\\"userId\\":\\"b292ff24a7bf4fffb9b5ee4da18c7328\\",\\"floor\\":6.25,\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"triplelift\\",\\"params\\":{\\"inventoryCode\\":\\"Acccuweather_Prebid_web_top_BIN\\",\\"floor\\":6.25,\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true}]},\\"adType\\":\\"top\\",\\"viewport\\":\\"tablet desktop\\",\\"adDivId\\":\\"top\\",\\"adUnitCode\\":\\"/6581/web/us/top/weather/current\\",\\"upr\\":4.0,\\"includeInSRA\\":true},\\"oop\\":{\\"config\\":{\\"bids\\":[{\\"bidder\\":\\"google\\",\\"params\\":{\\"sizes\\":\\"oop\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false}]},\\"adType\\":\\"oop\\",\\"adDivId\\":\\"oop\\",\\"adUnitCode\\":\\"/6581/web/us/oop/weather/current\\",\\"upr\\":0.02,\\"includeInSRA\\":true},\\"interstitial\\":{\\"config\\":{\\"bids\\":[{\\"bidder\\":\\"google\\",\\"params\\":{\\"sizes\\":\\"interstitial\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false}]},\\"adType\\":\\"interstitial\\",\\"adDivId\\":\\"interstitial\\",\\"adUnitCode\\":\\"/6581/web/us/interstitial/weather/current\\",\\"upr\\":9.75,\\"includeInSRA\\":false},\\"native\\":{\\"config\\":{\\"sizes\\":[\\"fluid\\",[2,2],[300,250]],\\"bids\\":[{\\"bidder\\":\\"google\\",\\"params\\":{\\"sizes\\":\\"300x250,fluid,2x2\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"triplelift\\",\\"params\\":{\\"inventoryCode\\":\\"accuweather_d_weather_native_pbjs\\",\\"floor\\":1.0,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false}]},\\"adType\\":\\"native\\",\\"adDivId\\":\\"native\\",\\"adUnitCode\\":\\"/6581/web/us/native/weather/current\\",\\"upr\\":1.8,\\"includeInSRA\\":true},\\"top_right\\":{\\"config\\":{\\"responsiveSizes\\":[{\\"window\\":[1024,0],\\"sizes\\":[\\"fluid\\",[300,250],[300,600],[250,360],[240,400],[160,600]]},{\\"window\\":[768,0],\\"sizes\\":[\\"fluid\\",[300,250],[300,600],[300,100],[250,360],[240,400],[160,600]]},{\\"window\\":[0,0],\\"sizes\\":[]}],\\"bids\\":[{\\"bidder\\":\\"google\\",\\"params\\":{\\"sizes\\":\\"300x250,300x600,160x600,120x600,fluid\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"appnexus\\",\\"params\\":{\\"placementId\\":29838030,\\"allowSmallerSizes\\":\\"FALSE\\",\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/top_right/weather/current\\"]},\\"reserve\\":1.8,\\"position\\":\\"above\\",\\"supplyType\\":\\"web\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"rubicon\\",\\"params\\":{\\"accountId\\":12562,\\"siteId\\":135890,\\"zoneId\\":2841912,\\"position\\":\\"atf\\",\\"userId\\":\\"b292ff24a7bf4fffb9b5ee4da18c7328\\",\\"floor\\":1.8,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"triplelift\\",\\"params\\":{\\"inventoryCode\\":\\"Acccuweather_Prebid_web_topright_highperformance_300x600\\",\\"floor\\":1.8,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"pubmatic\\",\\"params\\":{\\"publisherId\\":\\"34576\\",\\"adSlot\\":\\"Web_TopRight\\",\\"lat\\":\\"36.68\\",\\"lon\\":\\"-121.8\\",\\"kadfloor\\":\\"1.80\\",\\"currency\\":\\"USD\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"grid\\",\\"params\\":{\\"uid\\":6029,\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/top_right/weather/current\\"]},\\"bidFloor\\":1.8,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"yahoossp\\",\\"params\\":{\\"dcn\\":\\"8a9691d3017474551cc955a9acbd0027\\",\\"pos\\":\\"web_hb_top_2\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"ix\\",\\"params\\":{\\"siteId\\":\\"974819\\",\\"bidFloor\\":1.8,\\"bidFloorCur\\":\\"USD\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"openx\\",\\"params\\":{\\"delDomain\\":\\"accuweather-d.openx.net\\",\\"unit\\":\\"539580668\\",\\"customParams\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/top_right/weather/current\\"]},\\"customFloor\\":1.8,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"ttd\\",\\"params\\":{\\"supplySourceId\\":\\"accuweather\\",\\"publisherId\\":\\"1\\",\\"bidfloor\\":2.5,\\"currency\\":\\"USD\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"google\\",\\"params\\":{\\"sizes\\":\\"300x250,300x600,160x600,120x600,fluid\\",\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"appnexus\\",\\"params\\":{\\"placementId\\":18044796,\\"allowSmallerSizes\\":\\"FALSE\\",\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/top_right/weather/current\\"]},\\"reserve\\":5.75,\\"position\\":\\"above\\",\\"supplyType\\":\\"web\\",\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"rubicon\\",\\"params\\":{\\"accountId\\":12562,\\"siteId\\":135890,\\"zoneId\\":2745916,\\"position\\":\\"atf\\",\\"userId\\":\\"b292ff24a7bf4fffb9b5ee4da18c7328\\",\\"floor\\":5.75,\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"triplelift\\",\\"params\\":{\\"inventoryCode\\":\\"Acccuweather_Prebid_web_topright_BIN\\",\\"floor\\":5.75,\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true}]},\\"adType\\":\\"top_right\\",\\"viewport\\":\\"tablet desktop\\",\\"adDivId\\":\\"top_right\\",\\"adUnitCode\\":\\"/6581/web/us/top_right/weather/current\\",\\"upr\\":4.0,\\"includeInSRA\\":true},\\"bottom_right\\":{\\"config\\":{\\"responsiveSizes\\":[{\\"window\\":[1024,0],\\"sizes\\":[\\"fluid\\",[300,250],[300,600],[250,360],[240,400],[300,251],[300,601],[160,600]]},{\\"window\\":[768,0],\\"sizes\\":[\\"fluid\\",[300,250],[300,600],[300,100],[250,360],[240,400],[300,251],[300,601],[160,600]]},{\\"window\\":[0,0],\\"sizes\\":[]}],\\"bids\\":[{\\"bidder\\":\\"google\\",\\"params\\":{\\"sizes\\":\\"300x250,300x600,160x600,120x600,fluid\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"appnexus\\",\\"params\\":{\\"placementId\\":12729478,\\"allowSmallerSizes\\":\\"FALSE\\",\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/bottom_right/weather/current\\"]},\\"reserve\\":1.0,\\"position\\":\\"below\\",\\"supplyType\\":\\"web\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"rubicon\\",\\"params\\":{\\"accountId\\":12562,\\"siteId\\":135890,\\"zoneId\\":2745918,\\"position\\":\\"btf\\",\\"userId\\":\\"b292ff24a7bf4fffb9b5ee4da18c7328\\",\\"floor\\":1.0,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"triplelift\\",\\"params\\":{\\"inventoryCode\\":\\"accuweather_d_bottomright_rectangle_pbjs\\",\\"floor\\":1.0,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"pubmatic\\",\\"params\\":{\\"publisherId\\":\\"34576\\",\\"adSlot\\":\\"Web_BottomRight\\",\\"lat\\":\\"36.68\\",\\"lon\\":\\"-121.8\\",\\"kadfloor\\":\\"1.00\\",\\"currency\\":\\"USD\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"grid\\",\\"params\\":{\\"uid\\":6031,\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/bottom_right/weather/current\\"]},\\"bidFloor\\":1.0,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"yahoossp\\",\\"params\\":{\\"dcn\\":\\"8a9691d3017474551cc955a9acbd0027\\",\\"pos\\":\\"web_hb_bottom_2\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"ix\\",\\"params\\":{\\"siteId\\":\\"197765\\",\\"bidFloor\\":1.0,\\"bidFloorCur\\":\\"USD\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"openx\\",\\"params\\":{\\"delDomain\\":\\"accuweather-d.openx.net\\",\\"unit\\":\\"539580673\\",\\"customParams\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/bottom_right/weather/current\\"]},\\"customFloor\\":1.0,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"google\\",\\"params\\":{\\"sizes\\":\\"300x250,300x600,160x600,120x600,fluid\\",\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"appnexus\\",\\"params\\":{\\"placementId\\":29006657,\\"allowSmallerSizes\\":\\"FALSE\\",\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/bottom_right/weather/current\\"]},\\"reserve\\":3.5,\\"position\\":\\"below\\",\\"supplyType\\":\\"web\\",\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"rubicon\\",\\"params\\":{\\"accountId\\":12562,\\"siteId\\":135890,\\"zoneId\\":2745914,\\"position\\":\\"btf\\",\\"userId\\":\\"b292ff24a7bf4fffb9b5ee4da18c7328\\",\\"floor\\":3.5,\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"triplelift\\",\\"params\\":{\\"inventoryCode\\":\\"Acccuweather_Prebid_Web_bottomright_BIN\\",\\"floor\\":3.5,\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true}]},\\"adType\\":\\"bottom_right\\",\\"viewport\\":\\"tablet desktop\\",\\"adDivId\\":\\"bottom_right\\",\\"adUnitCode\\":\\"/6581/web/us/bottom_right/weather/current\\",\\"upr\\":1.3,\\"includeInSRA\\":true},\\"bottom\\":{\\"config\\":{\\"responsiveSizes\\":[{\\"window\\":[1024,0],\\"sizes\\":[\\"fluid\\",[980,120],[980,90],[970,251],[970,250],[970,90],[950,90],[930,180],[750,100],[750,200],[750,300],[728,91],[728,90]]},{\\"window\\":[768,0],\\"sizes\\":[\\"fluid\\",[728,91],[728,90],[468,60],[320,51],[320,50],[300,51],[300,50]]},{\\"window\\":[0,0],\\"sizes\\":[\\"fluid\\",[320,100],[320,51],[300,250],[300,600],[336,280],[320,50],[300,50],[300,100],[300,51],[300,251],[300,100],[250,360],[240,400]]}],\\"bids\\":[{\\"bidder\\":\\"google\\",\\"params\\":{\\"sizes\\":\\"970x250,728x90,fluid\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"appnexus\\",\\"params\\":{\\"placementId\\":12729477,\\"allowSmallerSizes\\":\\"FALSE\\",\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/bottom/weather/current\\"]},\\"reserve\\":1.0,\\"position\\":\\"below\\",\\"supplyType\\":\\"web\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"rubicon\\",\\"params\\":{\\"accountId\\":12562,\\"siteId\\":135890,\\"zoneId\\":640476,\\"position\\":\\"btf\\",\\"userId\\":\\"b292ff24a7bf4fffb9b5ee4da18c7328\\",\\"floor\\":1.0,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"triplelift\\",\\"params\\":{\\"inventoryCode\\":\\"accuweather_d_bottom_leaderboard_pbjs\\",\\"floor\\":1.0,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"pubmatic\\",\\"params\\":{\\"publisherId\\":\\"34576\\",\\"adSlot\\":\\"Web_Bottom\\",\\"lat\\":\\"36.68\\",\\"lon\\":\\"-121.8\\",\\"kadfloor\\":\\"1.00\\",\\"currency\\":\\"USD\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"grid\\",\\"params\\":{\\"uid\\":6030,\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/bottom/weather/current\\"]},\\"bidFloor\\":1.0,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"yahoossp\\",\\"params\\":{\\"dcn\\":\\"8a9691d3017474551cc955a9acbd0027\\",\\"pos\\":\\"web_hb_bottom_1\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"ix\\",\\"params\\":{\\"siteId\\":\\"197764\\",\\"bidFloor\\":1.0,\\"bidFloorCur\\":\\"USD\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"openx\\",\\"params\\":{\\"delDomain\\":\\"accuweather-d.openx.net\\",\\"unit\\":\\"539580672\\",\\"customParams\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/bottom/weather/current\\"]},\\"customFloor\\":1.0,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"google\\",\\"params\\":{\\"sizes\\":\\"970x250,728x90,fluid\\",\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"appnexus\\",\\"params\\":{\\"placementId\\":29006645,\\"allowSmallerSizes\\":\\"FALSE\\",\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/bottom/weather/current\\"]},\\"reserve\\":2.75,\\"position\\":\\"below\\",\\"supplyType\\":\\"web\\",\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"rubicon\\",\\"params\\":{\\"accountId\\":12562,\\"siteId\\":135890,\\"zoneId\\":2745912,\\"position\\":\\"btf\\",\\"userId\\":\\"b292ff24a7bf4fffb9b5ee4da18c7328\\",\\"floor\\":2.75,\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"triplelift\\",\\"params\\":{\\"inventoryCode\\":\\"Acccuweather_Prebid_Web_bottom_BIN\\",\\"floor\\":2.75,\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true}]},\\"adType\\":\\"bottom\\",\\"adDivId\\":\\"bottom\\",\\"adUnitCode\\":\\"/6581/web/us/bottom/weather/current\\",\\"upr\\":0.5,\\"includeInSRA\\":true}};
\t\tvar fcConsentCookie = '';
\t\tvar USPString = '1YNN';

\t\ttry {
\t\t\t;
\t\t} catch (error) {}

\t\t// A map object that stores all ads on page in order where key is the div id and value is the ad object
\t\tvar pageHasRepeatAds = false;
\t\tvar adsOnPage = new Map();
\t\tconst order = [\\"top\\",\\"top_right\\",\\"infeed\\",\\"bottom_right\\",\\"middle\\",\\"native\\",\\"bottom\\",\\"oop\\",\\"interstitial\\"];
\t\tconst orderedAds = Object.keys(window.serverAdsOnPageLite)
\t\t\t.sort((a, b) => order.indexOf(a.split('-')[0]) - order.indexOf(b.split('-')[0]))
\t\t\t.filter((adDivId) => order.indexOf(adDivId.split('-')[0]) > -1);
\t\torderedAds.forEach((adId) => {
\t\t\tconst adObject = window.serverAdsOnPageLite[adId];
\t\t\tadObject.winner = { auction: 0 };
\t\t\tconst strippedId = adId.split('-')[0];
\t\t\t// Mark repeating ad units
\t\t\tif (adsOnPage.has(strippedId)) {
\t\t\t\tadObject.isRepeat = true;
\t\t\t\twindow.serverAdsOnPageLite[strippedId].isRepeat = true;
\t\t\t\twindow.pageHasRepeatAds = true;
\t\t\t}
\t\t\tadsOnPage.set(adId, adObject)
\t\t});

\t\t// Parse lazy loading config
\t\tif (window.globalAdConfig?.lazyLoadingData) {
\t\t\tlet lazyLoadData;
\t\t\ttry {
\t\t\t\tlazyLoadData = JSON.parse(window.globalAdConfig.lazyLoadingData.replace(/(['\\"])?([a-z0-9A-Z_]+)(['\\"])?:/g, '\\"$2\\": '));
\t\t\t} catch (error) {}
\t\t\tif (typeof lazyLoadData === 'object' && Object.keys(lazyLoadData).length > 0) {
\t\t\t\twindow.globalAdConfig.lazyLoadingData = lazyLoadData;
\t\t\t} else {
\t\t\t\twindow.globalAdConfig.lazyLoadingData = null;
\t\t\t}
\t\t}
\t</script>

\t<script>
\tvar gaAppConfig = {
  \\"snowfallMap\\": true,
  \\"mapCta\\": true,
  \\"iceChart\\": true,
  \\"winterOutlookCard\\": true,
  \\"winterUpcomingCard\\": true,
  \\"impactedCities\\": true,
  \\"tempWindChart\\": true,
  \\"snowfallChart\\": true,
  \\"postEventCta\\": true,
  \\"winterCenterMap\\": true
};
\tvar userCookie = {\\"cDate\\":\\"2024-07-23\\",\\"isDarkMapStyle\\":false,\\"lang\\":\\"en-us\\",\\"rl\\":[\\"337145\\"],\\"tp\\":\\"F\\",\\"ccb\\":true,\\"userContentAffinity\\":{}};
\tvar recentLocations = [{\\"adminArea\\":{\\"englishName\\":\\"California\\",\\"id\\":\\"CA\\",\\"localizedName\\":\\"California\\"},\\"alertCount\\":0,\\"country\\":{\\"englishName\\":\\"United States\\",\\"id\\":\\"US\\",\\"localizedName\\":\\"United States\\"},\\"icon\\":1,\\"key\\":\\"337145\\",\\"localizedName\\":\\"Marina\\",\\"postalCode\\":\\"93933\\",\\"temp\\":\\"55°\\",\\"realFeel\\":\\"58°\\",\\"isDayTime\\":true}];
\tvar currentLocation = {\\"plumeLabsLink\\":\\"https://air.plumelabs.com/air-quality-in-marina-aw-337145\\",\\"dma\\":{\\"englishName\\":\\"Monterey-Salinas, CA\\",\\"id\\":\\"828\\",\\"localizedName\\":\\"Monterey-Salinas, CA\\"},\\"englishName\\":\\"Marina\\",\\"gmtOffset\\":-7.0,\\"hasAlerts\\":true,\\"hasForecastConfidence\\":true,\\"hasPollen\\":true,\\"hasMinuteCast\\":true,\\"hasFutureRadar\\":true,\\"lat\\":36.684,\\"lon\\":-121.802,\\"mediaRegion\\":\\"SW\\",\\"region\\":{\\"englishName\\":\\"North America\\",\\"id\\":\\"NAM\\",\\"localizedName\\":\\"North America\\"},\\"timeZone\\":\\"PDT\\",\\"timeZoneCode\\":\\"PDT\\",\\"administrativeArea\\":{\\"englishName\\":\\"California\\",\\"id\\":\\"CA\\",\\"localizedName\\":\\"California\\"},\\"country\\":{\\"englishName\\":\\"United States\\",\\"id\\":\\"US\\",\\"localizedName\\":\\"United States\\"},\\"key\\":\\"337145\\",\\"localizedName\\":\\"Marina\\",\\"primaryPostalCode\\":\\"93933\\",\\"source\\":\\"AccuWeather\\"};
\tvar serverAdsOnPage = [{\\"config\\":{\\"responsiveSizes\\":[{\\"window\\":[1024,0],\\"sizes\\":[\\"fluid\\",[980,120],[980,90],[970,250],[970,90],[950,90],[930,180],[750,100],[750,300],[750,200],[728,90]]},{\\"window\\":[768,0],\\"sizes\\":[\\"fluid\\",[728,90],[468,60],[320,50],[300,50]]},{\\"window\\":[0,0],\\"sizes\\":[[320,100],[320,50],[300,250],[300,100],[300,50],[250,360],[240,400]]}],\\"bids\\":[{\\"bidder\\":\\"google\\",\\"params\\":{\\"sizes\\":\\"970x250,728x90,fluid\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"appnexus\\",\\"params\\":{\\"placementId\\":29838031,\\"allowSmallerSizes\\":\\"FALSE\\",\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/top/weather/current\\"]},\\"reserve\\":1.8,\\"position\\":\\"above\\",\\"supplyType\\":\\"web\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"rubicon\\",\\"params\\":{\\"accountId\\":12562,\\"siteId\\":135890,\\"zoneId\\":2841914,\\"position\\":\\"atf\\",\\"userId\\":\\"b292ff24a7bf4fffb9b5ee4da18c7328\\",\\"floor\\":1.8,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"triplelift\\",\\"params\\":{\\"inventoryCode\\":\\"Acccuweather_Prebid_web_top_highperformance_970x250\\",\\"floor\\":1.8,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"pubmatic\\",\\"params\\":{\\"publisherId\\":\\"34576\\",\\"adSlot\\":\\"Web_Top\\",\\"lat\\":\\"36.68\\",\\"lon\\":\\"-121.8\\",\\"kadfloor\\":\\"1.80\\",\\"currency\\":\\"USD\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"grid\\",\\"params\\":{\\"uid\\":6028,\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/top/weather/current\\"]},\\"bidFloor\\":1.8,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"yahoossp\\",\\"params\\":{\\"dcn\\":\\"8a9691d3017474551cc955a9acbd0027\\",\\"pos\\":\\"web_hb_top_1\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"ix\\",\\"params\\":{\\"siteId\\":\\"974818\\",\\"bidFloor\\":1.8,\\"bidFloorCur\\":\\"USD\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"openx\\",\\"params\\":{\\"delDomain\\":\\"accuweather-d.openx.net\\",\\"unit\\":\\"539580665\\",\\"customParams\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/top/weather/current\\"]},\\"customFloor\\":1.8,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"ttd\\",\\"params\\":{\\"supplySourceId\\":\\"accuweather\\",\\"publisherId\\":\\"1\\",\\"bidfloor\\":3.75,\\"currency\\":\\"USD\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"google\\",\\"params\\":{\\"sizes\\":\\"970x250,728x90,fluid\\",\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"appnexus\\",\\"params\\":{\\"placementId\\":18044795,\\"allowSmallerSizes\\":\\"FALSE\\",\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/top/weather/current\\"]},\\"reserve\\":6.25,\\"position\\":\\"above\\",\\"supplyType\\":\\"web\\",\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"rubicon\\",\\"params\\":{\\"accountId\\":12562,\\"siteId\\":135890,\\"zoneId\\":1518598,\\"position\\":\\"atf\\",\\"userId\\":\\"b292ff24a7bf4fffb9b5ee4da18c7328\\",\\"floor\\":6.25,\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"triplelift\\",\\"params\\":{\\"inventoryCode\\":\\"Acccuweather_Prebid_web_top_BIN\\",\\"floor\\":6.25,\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true}]},\\"adType\\":\\"top\\",\\"viewport\\":\\"tablet desktop\\",\\"adDivId\\":\\"top\\",\\"adUnitCode\\":\\"/6581/web/us/top/weather/current\\",\\"upr\\":4.0,\\"includeInSRA\\":true},{\\"config\\":{\\"bids\\":[{\\"bidder\\":\\"google\\",\\"params\\":{\\"sizes\\":\\"oop\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false}]},\\"adType\\":\\"oop\\",\\"adDivId\\":\\"oop\\",\\"adUnitCode\\":\\"/6581/web/us/oop/weather/current\\",\\"upr\\":0.02,\\"includeInSRA\\":true},{\\"config\\":{\\"bids\\":[{\\"bidder\\":\\"google\\",\\"params\\":{\\"sizes\\":\\"interstitial\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false}]},\\"adType\\":\\"interstitial\\",\\"adDivId\\":\\"interstitial\\",\\"adUnitCode\\":\\"/6581/web/us/interstitial/weather/current\\",\\"upr\\":9.75,\\"includeInSRA\\":false},{\\"config\\":{\\"sizes\\":[\\"fluid\\",[2,2],[300,250]],\\"bids\\":[{\\"bidder\\":\\"google\\",\\"params\\":{\\"sizes\\":\\"300x250,fluid,2x2\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"triplelift\\",\\"params\\":{\\"inventoryCode\\":\\"accuweather_d_weather_native_pbjs\\",\\"floor\\":1.0,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false}]},\\"adType\\":\\"native\\",\\"adDivId\\":\\"native\\",\\"adUnitCode\\":\\"/6581/web/us/native/weather/current\\",\\"upr\\":1.8,\\"includeInSRA\\":true},{\\"config\\":{\\"responsiveSizes\\":[{\\"window\\":[1024,0],\\"sizes\\":[\\"fluid\\",[300,250],[300,600],[250,360],[240,400],[160,600]]},{\\"window\\":[768,0],\\"sizes\\":[\\"fluid\\",[300,250],[300,600],[300,100],[250,360],[240,400],[160,600]]},{\\"window\\":[0,0],\\"sizes\\":[]}],\\"bids\\":[{\\"bidder\\":\\"google\\",\\"params\\":{\\"sizes\\":\\"300x250,300x600,160x600,120x600,fluid\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"appnexus\\",\\"params\\":{\\"placementId\\":29838030,\\"allowSmallerSizes\\":\\"FALSE\\",\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/top_right/weather/current\\"]},\\"reserve\\":1.8,\\"position\\":\\"above\\",\\"supplyType\\":\\"web\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"rubicon\\",\\"params\\":{\\"accountId\\":12562,\\"siteId\\":135890,\\"zoneId\\":2841912,\\"position\\":\\"atf\\",\\"userId\\":\\"b292ff24a7bf4fffb9b5ee4da18c7328\\",\\"floor\\":1.8,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"triplelift\\",\\"params\\":{\\"inventoryCode\\":\\"Acccuweather_Prebid_web_topright_highperformance_300x600\\",\\"floor\\":1.8,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"pubmatic\\",\\"params\\":{\\"publisherId\\":\\"34576\\",\\"adSlot\\":\\"Web_TopRight\\",\\"lat\\":\\"36.68\\",\\"lon\\":\\"-121.8\\",\\"kadfloor\\":\\"1.80\\",\\"currency\\":\\"USD\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"grid\\",\\"params\\":{\\"uid\\":6029,\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/top_right/weather/current\\"]},\\"bidFloor\\":1.8,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"yahoossp\\",\\"params\\":{\\"dcn\\":\\"8a9691d3017474551cc955a9acbd0027\\",\\"pos\\":\\"web_hb_top_2\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"ix\\",\\"params\\":{\\"siteId\\":\\"974819\\",\\"bidFloor\\":1.8,\\"bidFloorCur\\":\\"USD\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"openx\\",\\"params\\":{\\"delDomain\\":\\"accuweather-d.openx.net\\",\\"unit\\":\\"539580668\\",\\"customParams\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/top_right/weather/current\\"]},\\"customFloor\\":1.8,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"ttd\\",\\"params\\":{\\"supplySourceId\\":\\"accuweather\\",\\"publisherId\\":\\"1\\",\\"bidfloor\\":2.5,\\"currency\\":\\"USD\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"google\\",\\"params\\":{\\"sizes\\":\\"300x250,300x600,160x600,120x600,fluid\\",\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"appnexus\\",\\"params\\":{\\"placementId\\":18044796,\\"allowSmallerSizes\\":\\"FALSE\\",\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/top_right/weather/current\\"]},\\"reserve\\":5.75,\\"position\\":\\"above\\",\\"supplyType\\":\\"web\\",\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"rubicon\\",\\"params\\":{\\"accountId\\":12562,\\"siteId\\":135890,\\"zoneId\\":2745916,\\"position\\":\\"atf\\",\\"userId\\":\\"b292ff24a7bf4fffb9b5ee4da18c7328\\",\\"floor\\":5.75,\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"triplelift\\",\\"params\\":{\\"inventoryCode\\":\\"Acccuweather_Prebid_web_topright_BIN\\",\\"floor\\":5.75,\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true}]},\\"adType\\":\\"top_right\\",\\"viewport\\":\\"tablet desktop\\",\\"adDivId\\":\\"top_right\\",\\"adUnitCode\\":\\"/6581/web/us/top_right/weather/current\\",\\"upr\\":4.0,\\"includeInSRA\\":true},{\\"config\\":{\\"responsiveSizes\\":[{\\"window\\":[1024,0],\\"sizes\\":[\\"fluid\\",[300,250],[300,600],[250,360],[240,400],[300,251],[300,601],[160,600]]},{\\"window\\":[768,0],\\"sizes\\":[\\"fluid\\",[300,250],[300,600],[300,100],[250,360],[240,400],[300,251],[300,601],[160,600]]},{\\"window\\":[0,0],\\"sizes\\":[]}],\\"bids\\":[{\\"bidder\\":\\"google\\",\\"params\\":{\\"sizes\\":\\"300x250,300x600,160x600,120x600,fluid\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"appnexus\\",\\"params\\":{\\"placementId\\":12729478,\\"allowSmallerSizes\\":\\"FALSE\\",\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/bottom_right/weather/current\\"]},\\"reserve\\":1.0,\\"position\\":\\"below\\",\\"supplyType\\":\\"web\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"rubicon\\",\\"params\\":{\\"accountId\\":12562,\\"siteId\\":135890,\\"zoneId\\":2745918,\\"position\\":\\"btf\\",\\"userId\\":\\"b292ff24a7bf4fffb9b5ee4da18c7328\\",\\"floor\\":1.0,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"triplelift\\",\\"params\\":{\\"inventoryCode\\":\\"accuweather_d_bottomright_rectangle_pbjs\\",\\"floor\\":1.0,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"pubmatic\\",\\"params\\":{\\"publisherId\\":\\"34576\\",\\"adSlot\\":\\"Web_BottomRight\\",\\"lat\\":\\"36.68\\",\\"lon\\":\\"-121.8\\",\\"kadfloor\\":\\"1.00\\",\\"currency\\":\\"USD\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"grid\\",\\"params\\":{\\"uid\\":6031,\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/bottom_right/weather/current\\"]},\\"bidFloor\\":1.0,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"yahoossp\\",\\"params\\":{\\"dcn\\":\\"8a9691d3017474551cc955a9acbd0027\\",\\"pos\\":\\"web_hb_bottom_2\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"ix\\",\\"params\\":{\\"siteId\\":\\"197765\\",\\"bidFloor\\":1.0,\\"bidFloorCur\\":\\"USD\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"openx\\",\\"params\\":{\\"delDomain\\":\\"accuweather-d.openx.net\\",\\"unit\\":\\"539580673\\",\\"customParams\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/bottom_right/weather/current\\"]},\\"customFloor\\":1.0,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"google\\",\\"params\\":{\\"sizes\\":\\"300x250,300x600,160x600,120x600,fluid\\",\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"appnexus\\",\\"params\\":{\\"placementId\\":29006657,\\"allowSmallerSizes\\":\\"FALSE\\",\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/bottom_right/weather/current\\"]},\\"reserve\\":3.5,\\"position\\":\\"below\\",\\"supplyType\\":\\"web\\",\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"rubicon\\",\\"params\\":{\\"accountId\\":12562,\\"siteId\\":135890,\\"zoneId\\":2745914,\\"position\\":\\"btf\\",\\"userId\\":\\"b292ff24a7bf4fffb9b5ee4da18c7328\\",\\"floor\\":3.5,\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"triplelift\\",\\"params\\":{\\"inventoryCode\\":\\"Acccuweather_Prebid_Web_bottomright_BIN\\",\\"floor\\":3.5,\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true}]},\\"adType\\":\\"bottom_right\\",\\"viewport\\":\\"tablet desktop\\",\\"adDivId\\":\\"bottom_right\\",\\"adUnitCode\\":\\"/6581/web/us/bottom_right/weather/current\\",\\"upr\\":1.3,\\"includeInSRA\\":true},{\\"config\\":{\\"responsiveSizes\\":[{\\"window\\":[1024,0],\\"sizes\\":[\\"fluid\\",[980,120],[980,90],[970,251],[970,250],[970,90],[950,90],[930,180],[750,100],[750,200],[750,300],[728,91],[728,90]]},{\\"window\\":[768,0],\\"sizes\\":[\\"fluid\\",[728,91],[728,90],[468,60],[320,51],[320,50],[300,51],[300,50]]},{\\"window\\":[0,0],\\"sizes\\":[\\"fluid\\",[320,100],[320,51],[300,250],[300,600],[336,280],[320,50],[300,50],[300,100],[300,51],[300,251],[300,100],[250,360],[240,400]]}],\\"bids\\":[{\\"bidder\\":\\"google\\",\\"params\\":{\\"sizes\\":\\"970x250,728x90,fluid\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"appnexus\\",\\"params\\":{\\"placementId\\":12729477,\\"allowSmallerSizes\\":\\"FALSE\\",\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/bottom/weather/current\\"]},\\"reserve\\":1.0,\\"position\\":\\"below\\",\\"supplyType\\":\\"web\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"rubicon\\",\\"params\\":{\\"accountId\\":12562,\\"siteId\\":135890,\\"zoneId\\":640476,\\"position\\":\\"btf\\",\\"userId\\":\\"b292ff24a7bf4fffb9b5ee4da18c7328\\",\\"floor\\":1.0,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"triplelift\\",\\"params\\":{\\"inventoryCode\\":\\"accuweather_d_bottom_leaderboard_pbjs\\",\\"floor\\":1.0,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"pubmatic\\",\\"params\\":{\\"publisherId\\":\\"34576\\",\\"adSlot\\":\\"Web_Bottom\\",\\"lat\\":\\"36.68\\",\\"lon\\":\\"-121.8\\",\\"kadfloor\\":\\"1.00\\",\\"currency\\":\\"USD\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"grid\\",\\"params\\":{\\"uid\\":6030,\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/bottom/weather/current\\"]},\\"bidFloor\\":1.0,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"yahoossp\\",\\"params\\":{\\"dcn\\":\\"8a9691d3017474551cc955a9acbd0027\\",\\"pos\\":\\"web_hb_bottom_1\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"ix\\",\\"params\\":{\\"siteId\\":\\"197764\\",\\"bidFloor\\":1.0,\\"bidFloorCur\\":\\"USD\\",\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"openx\\",\\"params\\":{\\"delDomain\\":\\"accuweather-d.openx.net\\",\\"unit\\":\\"539580672\\",\\"customParams\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/bottom/weather/current\\"]},\\"customFloor\\":1.0,\\"Is_Buy_It_Now\\":false},\\"isBuyItNow\\":false},{\\"bidder\\":\\"google\\",\\"params\\":{\\"sizes\\":\\"970x250,728x90,fluid\\",\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"appnexus\\",\\"params\\":{\\"placementId\\":29006645,\\"allowSmallerSizes\\":\\"FALSE\\",\\"keywords\\":{\\"fdate\\":[\\"20240723\\"],\\"advelvet\\":[\\"18\\"],\\"pgview\\":[\\"5\\"],\\"partner\\":[\\"accuweather\\"],\\"ufdb\\":[\\"MARI\\"],\\"country\\":[\\"US\\"],\\"state\\":[\\"CA\\"],\\"dma\\":[\\"828\\"],\\"wx_seg\\":[\\"108105100\\",\\"101103100\\",\\"109101100\\",\\"108103102\\",\\"100108101\\",\\"102102100\\",\\"110100100\\",\\"102101100\\",\\"108102100\\",\\"101108100\\",\\"100106104\\",\\"103101104\\",\\"999100000\\",\\"101100100\\",\\"102100100\\",\\"108104101\\",\\"102103100\\",\\"102104100\\",\\"101107100\\",\\"101105100\\",\\"101104101\\",\\"101106101\\",\\"100109107\\",\\"101101104\\",\\"100109104\\",\\"109100104\\",\\"105100104\\",\\"101102100\\",\\"107100104\\",\\"109104102\\",\\"108100104\\",\\"109102104\\",\\"109106104\\",\\"100111101\\",\\"103100104\\",\\"107101104\\",\\"108101104\\",\\"100113102\\",\\"109105102\\",\\"110102101\\",\\"109103104\\",\\"104100104\\",\\"104101104\\",\\"100112103\\"],\\"cuhd\\":[\\"88\\"],\\"cuhi\\":[\\"61\\"],\\"cuuv\\":[\\"5\\"],\\"cuwd\\":[\\"9\\"],\\"cuwx\\":[\\"1\\"],\\"realfeel\\":[\\"60\\",\\"a70\\"],\\"fc1hi\\":[\\"60\\"],\\"fc1lo\\":[\\"57\\"],\\"fc1wx\\":[\\"2\\"],\\"lfscategory\\":[\\"fog\\"],\\"lfsday\\":[\\"3\\"],\\"lfsseverity\\":[\\"5\\"],\\"lfs\\":[\\"5_fog_3\\"],\\"pt\\":[\\"0\\"],\\"adunit\\":[\\"/6581/web/us/bottom/weather/current\\"]},\\"reserve\\":2.75,\\"position\\":\\"below\\",\\"supplyType\\":\\"web\\",\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"rubicon\\",\\"params\\":{\\"accountId\\":12562,\\"siteId\\":135890,\\"zoneId\\":2745912,\\"position\\":\\"btf\\",\\"userId\\":\\"b292ff24a7bf4fffb9b5ee4da18c7328\\",\\"floor\\":2.75,\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true},{\\"bidder\\":\\"triplelift\\",\\"params\\":{\\"inventoryCode\\":\\"Acccuweather_Prebid_Web_bottom_BIN\\",\\"floor\\":2.75,\\"Is_Buy_It_Now\\":true},\\"isBuyItNow\\":true}]},\\"adType\\":\\"bottom\\",\\"adDivId\\":\\"bottom\\",\\"adUnitCode\\":\\"/6581/web/us/bottom/weather/current\\",\\"upr\\":0.5,\\"includeInSRA\\":true}];
\tvar weatherEvents = [];
\tvar userData = {\\"city\\":\\"MONTEREY\\",\\"continent\\":3,\\"countryCode\\":\\"US\\",\\"county\\":\\"MONTEREY\\",\\"dma\\":828,\\"fips\\":6053,\\"lat\\":36.5816,\\"lon\\":-121.8436,\\"msa\\":7120,\\"regionCode\\":\\"CA\\",\\"throughput\\":\\"vhigh\\",\\"bw\\":\\"5000\\",\\"networkType\\":\\"cable\\",\\"network\\":\\"comcast\\",\\"zipCodes\\":[{\\"primary\\":\\"93940\\"},{\\"extended\\":\\"93944\\",\\"primary\\":\\"93942\\"}],\\"device\\":{\\"browserVersion\\":\\"\\"}};
\tvar isUserCountryEEA = false;
\tvar showPrivacyPolicyBanner = true;
\tvar mapbox={token:'pk.eyJ1IjoiYWNjdXdlYXRoZXItaW5jIiwiYSI6ImNqeGtxeDc4ZDAyY2czcnA0Ym9ubzh0MTAifQ.HjSuXwG2bI05yFYmc0c9lw',style:'mapbox://styles/accuweather-inc/cjknc24na2o5u2sqoy0t8ku8a'};
\tvar dts={token:'de13920f574d420984d3080b1fa6132b'};
\tsetTimeout(function() {
\t\tvar reg = new RegExp('(\\\\\\\\s|^)' + 'ads-not-loaded' + '(\\\\\\\\s|$)');
\t\tif (document.body.hasAttribute('class')) {
\t\t\tdocument.body.setAttribute('class', document.body.getAttribute('class').replace(reg, ' '));
\t\t}
\t}, 3000);
</script>

\t<script>
\tvar hostEnvironment = 'Production-WUS2-K8S';
\tvar pageId = 'current-weather';
\tvar siteVersion = \\"2.2.59.0\\";
\tvar activeFeatureTest = '';
</script>

\t
\t<script type=\\"text/javascript\\">
\t\tvar PushlySDK = window.PushlySDK || [];
\t\tfunction pushly() { PushlySDK.push(arguments) }
\t\twindow.pushlyCallback = function() {
\t\t\tpushly('load', {
\t\t\t\tdomainKey: '16if7iQ5tgH1FcRA4cUeejyVcdf5guIAEV9R',
\t\t\t\tsw: '/pushly-sdk-worker.js'
\t\t\t});
\t\t};
\t</script>



\t<script>const startMetric=Date.now();function measureTiming(t){var e=Date.now()-startMetric;console.log(t+\\": \\"+e);window[t]=e}</script>

\t<script>
\tfunction getTDateISOOffset() {
\t\tconst z = (n) => ('0' + n).slice(-2);
\t\tconst offset = new Date().getTimezoneOffset();
\t\tconst hours = Math.floor(Math.abs(offset) / 60);
\t\tconst minutes = Math.abs(offset) % 60;
\t\tconst sign = offset > 0 ? '-' : '+';
\t\treturn \`\${sign}\${z(hours)}:\${z(minutes)}\`;
\t}

\tfunction createRainePerformanceMark(name) {
\t\tif ('performance' in window) {
\t\t\tconst markName = \`aw:\${name}\`;

\t\t\t// Only fire one timeOnPage mark per session.
\t\t\tif (
\t\t\t\tname === 'raine:timeOnPage' &&
\t\t\t\tperformance.getEntriesByName(markName).length !== 0
\t\t\t) {
\t\t\t\treturn;
\t\t\t}

\t\t\tperformance.mark(markName);
\t\t}
\t}

\tfunction normalizeMarkToTimer(entry, nameParts) {
\t\tconst timerNameParts = nameParts ?? entry.name.split(':');
\t\treturn {
\t\t\tname: timerNameParts.slice(1).join(':'),
\t\t\ttime: Math.round(entry.startTime),
\t\t};
\t}

\tif ('performance' in window) {
\t\twindow.pbjs = window.pbjs || {};
\t\tpbjs.que = pbjs.que || [];
\t\tpbjs.que.push(() => {
\t\t\tpbjs.onEvent('auctionInit', () => {
\t\t\t\tcreateRainePerformanceMark('prebid:auctionInit');
\t\t\t});
\t\t\tpbjs.onEvent('auctionEnd', () => {
\t\t\t\tcreateRainePerformanceMark('prebid:auctionEnd');
\t\t\t});
\t\t\tpbjs.onEvent('requestBids', () => {
\t\t\t\tcreateRainePerformanceMark('prebid:requestBids');
\t\t\t});
\t\t\tpbjs.onEvent('setTargeting', () => {
\t\t\t\tcreateRainePerformanceMark('prebid:setTargeting');
\t\t\t});
\t\t});

\t\twindow.googletag = window.googletag || { cmd: [] };

\t\tfunction truncateAdId(adDivId) {
\t\t\t// /6581/{platform}/{locationId}/{adType}/{category}/{adPageInfo.Template}{suffix}
\t\t\tif (adDivId) {
\t\t\t\tconst arr = adDivId.split('/');
\t\t\t\tif (arr.length > 1) {
\t\t\t\t\tconst idIndex = arr.findIndex(x => x === '6581');
\t\t\t\t\tadDivId = arr[idIndex + 3];
\t\t\t\t}
\t\t\t}
\t\t\treturn adDivId;
\t\t}

\t\t// ONE-1198 to restrict gpt to 'top' slot only.
\t\tfunction isSupportedAdId(adDivId) {
\t\t\treturn ['top'].includes(adDivId);
\t\t}

\t\tgoogletag.cmd.push(() => {
\t\t\tgoogletag.pubads().addEventListener('slotRequested', event => {
\t\t\t\tlet adDivId = event.slot.getSlotElementId();
\t\t\t\tadDivId = truncateAdId(adDivId);
\t\t\t\tif (isSupportedAdId(adDivId)) {
\t\t\t\t\tcreateRainePerformanceMark(\`gpt:slotRequested:\${adDivId}\`);
\t\t\t\t}
\t\t\t});
\t\t\tgoogletag.pubads().addEventListener('slotOnload', event => {
\t\t\t\tlet adDivId = event.slot.getSlotElementId();
\t\t\t\tadDivId = truncateAdId(adDivId);
\t\t\t\tif (isSupportedAdId(adDivId)) {
\t\t\t\t\tcreateRainePerformanceMark(\`gpt:slotOnload:\${adDivId}\`);
\t\t\t\t}
\t\t\t});
\t\t\tgoogletag.pubads().addEventListener('slotRenderEnded', event => {
\t\t\t\tlet adDivId = event.slot.getSlotElementId();
\t\t\t\tadDivId = truncateAdId(adDivId);
\t\t\t\tif (isSupportedAdId(adDivId)) {
\t\t\t\t\tcreateRainePerformanceMark(\`gpt:slotRenderEnded:\${adDivId}\`);
\t\t\t\t}
\t\t\t});
\t\t});

\t\twindow.addEventListener(\\"DOMContentLoaded\\", (event) => {
\t\t\tcreateRainePerformanceMark('document:DOMContentLoaded');
\t\t});

\t\twindow.addEventListener(\\"load\\", (event) => {
\t\t\tcreateRainePerformanceMark('document:windowLoad');
\t\t});
\t}

\twindow.raine = {
\t\tpageview: {
\t\t\tid: '90728477-d4ee-41f2-9dc0-7a02e088809e',
\t\t\ttest: 'raine_variant',
\t\t\tplatform: 'glacier',
\t\t\tversion: '2.2.59.0',
\t\t\tpage: {
\t\t\t\tgroup: 'current-weather',
\t\t\t\turl: '/en/us/marina/93933/current-weather/337145',
\t\t\t\treferrer: '',
\t\t\t},
\t\t\tads: {
\t\t\t\tcode: '/6581/web/us/top/weather/current',
\t\t\t\tstatus: 'active',
\t\t\t\tcookie3p: 'active'
\t\t\t},
\t\t\tsession: {
\t\t\t\tid: '91c01f0d-88d9-4518-b57b-f2388ed84500',
\t\t\t\tpartner: '',
\t\t\t\tutm: {
\t\t\t\t\tsource: '',
\t\t\t\t\tmedium: '',
\t\t\t\t\tcampaign: '',
\t\t\t\t\tterm: ''
\t\t\t\t}
\t\t\t},
\t\t\tuser: {
\t\t\t\tid: 'b292ff24-a7bf-4fff-b9b5-ee4da18c7328',
\t\t\t\tlanguage: 'en-us',
\t\t\t\tcountry: 'US',
\t\t\t\tregion: 'CA',
\t\t\t\tcity: 'MONTEREY',
\t\t\t\tdma: '828',
\t\t\t\tstart: '2024-07-23',
\t\t\t\toffset: getTDateISOOffset(),
\t\t\t},
\t\t\tdevice: {
\t\t\t\tname: 'cfnetwork app',
\t\t\t\tbrand: 'Apple',
\t\t\t\tversion: '',
\t\t\t\tcategory: 'desktop'
\t\t\t},
\t\t\tweather: {
\t\t\t\tkey: '337145'
\t\t\t},
\t\t\tbot: false,
\t\t\ttime: '2024-07-23T22:55:41Z',
\t\t}
\t}

\tfunction tryAddTimer(timers, name) {
\t\tif (window[name]) {
\t\t\ttimers.push({
\t\t\t\tname: name,
\t\t\t\ttime: window[name]
\t\t\t});
\t\t}
\t}

\tlet scrollDepth = 0;
\t// Get maximum scroll depth percentage of page every time the user scrolls
\twindow.addEventListener(\\"scroll\\", function logScrollDepth() {
\t\tconst currentScrollDepth = Math.round((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100);
\t\tscrollDepth = Math.max(scrollDepth, currentScrollDepth);
\t});

\tfunction createPageLeave() {
\t\tconst timers = [];
\t\tif ('performance' in window) {
\t\t\tcreateRainePerformanceMark('raine:timeOnPage');
\t\t\tperformance.getEntriesByType('mark').forEach((entry) => {
\t\t\t\tconst timerNameParts = entry.name.split(':');
\t\t\t\tif (timerNameParts[0] === 'aw' && timerNameParts.length > 2) {
\t\t\t\t\ttimers.push(normalizeMarkToTimer(entry, timerNameParts));
\t\t\t\t}
\t\t\t});
\t\t}

\t\treturn {
\t\t\tid: window.raine.pageview.id,
\t\t\tscroll: scrollDepth,
\t\t\ttimers: timers,
\t\t};
\t}

\twindow.pageLeave = () => {
\t\twindow.raine.pageleave = createPageLeave();
\t\treturn window.raine;
\t};

\tif (navigator && navigator.sendBeacon) {
\t\tconst headers = {
\t\t\ttype: 'application/json',
\t\t};
\t\tnavigator.sendBeacon(\\"https://raine.accuweather.com/rainev1/p\\", new Blob([JSON.stringify(window.raine.pageview)], headers));

\t\tlet pageleaveFired = false;
\t\tdocument.addEventListener(\\"visibilitychange\\", function logData() {
\t\t\tif (document.visibilityState === \\"hidden\\" && !pageleaveFired) {
\t\t\t\tpageleaveFired = true;
\t\t\t\twindow.raine.pageleave = createPageLeave();
\t\t\t\tnavigator.sendBeacon(\\"https://raine.accuweather.com/rainev1/leavepage\\", new Blob([JSON.stringify(window.raine.pageleave)], headers));
\t\t\t}
\t\t});
\t}
</script>

\t
<script>window.isUserCountryEEA = false;</script>

\t\t\t<script charset=\\"utf-8\\" src=\\"https://www.awxcdn.com/adc-assets/bundles/prebid-b.eadb75e1d63b23b6d4d4.js\\" async></script>

\t<script src=\\"https://securepubads.g.doubleclick.net/tag/js/gpt.js\\" async></script>
\t<script>
\t\twindow.pbjs = window.pbjs || {};
\t\tpbjs.que = pbjs.que || [];
\t\t// Initialize ad info
\t\twindow.measureTiming('AdManager_Initialization');
\t\tadInfo['hour'] = new Date().getHours().toString();
\t\tconst width = document.documentElement.clientWidth;
\t\tconst height = document.documentElement.clientHeight;
\t\tconst round = x => Math.ceil(x / 10) * 10;
\t\tadInfo['viewport'] = \`\${round(width)}x\${round(height)}\`;
\t\tadInfo['site'] = width >= 768
\t\t\t? (width >= 1024 ? 'desktop' : 'tablet')
\t\t\t: 'mobile';
\t\t// Helper function for uprTargeting
\t\twindow.uprTargeting = (gptSlot, adObject) => {

\t\t\t\tconst highestPrebid = pbjs?.getHighestCpmBids ? pbjs.getHighestCpmBids(adObject.adUnitCode) : [];
\t\t\t\tconst prebidCPM = highestPrebid.length ? highestPrebid[0].cpm || 0 : 0;
\t\t\t\tconst round = (n) => {
\t\t\t\t\tif (n > 15) {
\t\t\t\t\t\treturn '15.00';
\t\t\t\t\t} else if (n > 10) {
\t\t\t\t\t\treturn String(Math.round(n).toFixed(2));
\t\t\t\t\t} else {
\t\t\t\t\t\t// Round to closest half
\t\t\t\t\t\treturn String((Math.round(n * 2) / 2).toFixed(2));
\t\t\t\t\t}
\t\t\t\t};
\t\t\t\tconst upr_0 = prebidCPM ? round(prebidCPM) : 'no_bid';
\t\t\t\tlet hb_bid_1st = 'no_bid';
\t\t\t\tlet hb_bid_2nd = 'no_bid';
\t\t\t\tif (pbjs?.getBidResponsesForAdUnitCode) {
\t\t\t\t\tconst formatCpm = (cpm) => (Math.round(cpm * 10) / 10).toFixed(2);
\t\t\t\t\tconst bidResponses = pbjs.getBidResponsesForAdUnitCode(adObject.adUnitCode).bids;
\t\t\t\t\tbidResponses.sort((a, b) => b.cpm - a.cpm);
\t\t\t\t\tif (bidResponses[0]) {
\t\t\t\t\t\thb_bid_1st = formatCpm(bidResponses[0].cpm);
\t\t\t\t\t}
\t\t\t\t\tif (bidResponses[1]) {
\t\t\t\t\t\thb_bid_2nd = formatCpm(bidResponses[1].cpm);
\t\t\t\t\t}
\t\t\t\t}
\t\t\t\tconst uprTargeting = {
\t\t\t\t\tupr: adObject.upr,
\t\t\t\t\tupr_0,
\t\t\t\t\tupr_auction: 'prebid',
\t\t\t\t\tuserid3pbid: \`\${window.adInfo['userid3p']}-\${upr_0}\`,
\t\t\t\t\thb_bid_1st,
\t\t\t\t\thb_bid_2nd,
\t\t\t\t};
\t\t\t\t\t\t\tif (gptSlot) {
\t\t\t\tObject.keys(uprTargeting).forEach((key) => {
\t\t\t\t\tif (uprTargeting[key]) {
\t\t\t\t\t\tgptSlot.setTargeting(key, String(uprTargeting[key]));
\t\t\t\t\t}
\t\t\t\t});
\t\t\t}
\t\t\treturn uprTargeting;
\t\t};
\t</script>
\t<script>
\t\twindow.BIDDING_TIMEOUT = (window.globalAdConfig && typeof window.globalAdConfig.prebidTimeout === 'number') ? window.globalAdConfig.prebidTimeout : 750;
\t\t// Initialize prebid
\t\tpbjs.que.push(() => {
\t\t\t// Record prebid loaded event

\t\t\t// Pbjs config
\t\t\tconst weatherLocData = window.currentLocation;
\t\t\tlet ortb2Geo = {};
\t\t\tif (weatherLocData?.country?.id === 'US') {
\t\t\t\tortb2Geo = {
\t\t\t\t\tcountry: 'usa',
\t\t\t\t\tregion: weatherLocData.administrativeArea?.id,
\t\t\t\t\tmetro: weatherLocData.dma?.id,
\t\t\t\t\tcity: weatherLocData.englishName,
\t\t\t\t\tzip: weatherLocData.primaryPostalCode,
\t\t\t\t\tutcoffset: weatherLocData.gmtOffset * 60,
\t\t\t\t};
\t\t\t}
\t\t\tconst ortb2User = { data: {} };
\t\t\t(['userid', 'userid3p', 'partner', 'pgview', 'pt', 'viewport', 'hour']).forEach((key) => {
\t\t\t\tif (window.adInfo && window.adInfo[key]) {
\t\t\t\t\tortb2User.data[key] = window.adInfo[key].replaceAll('-', 'neg');
\t\t\t\t}
\t\t\t});
\t\t\tconst ortbSiteConfig = window.globalAdConfig?.ortbSite;
\t\t\tlet ortb2Site = {
\t\t\t\tname: 'AccuWeather',
\t\t\t\tdomain: 'www.accuweather.com',
\t\t\t\tcat: ['IAB-7', 'IAB7-4', 'IAB15-10', 'IAB20', '288', '390', '653'],
\t\t\t\tpage: \`\${window.location.protocol}//\${window.location.host}\${window.location.pathname}\`,
\t\t\t\tref: document.referrer,
\t\t\t\tmobile: 1,
\t\t\t\tprivacypolicy: 1,
\t\t\t\tpublisher: {
\t\t\t\t\tname: 'AccuWeather',
\t\t\t\t\tdomain: 'www.accuweather.com',
\t\t\t\t\tcat: ['IAB-7', 'IAB7-4', 'IAB15-10', 'IAB20', '288', '390', '653'],
\t\t\t\t},
\t\t\t\tcontent: {
\t\t\t\t\tlanguage: window.userCookie?.lang?.substring(0, 2),
\t\t\t\t},
\t\t\t\text: {
\t\t\t\t\tdata: {},
\t\t\t\t},
\t\t\t};
\t\t\tif (ortbSiteConfig) {
\t\t\t\tortb2Site = {
\t\t\t\t\tname: ortbSiteConfig.name,
\t\t\t\t\tdomain: ortbSiteConfig.domain,
\t\t\t\t\tcat: ortbSiteConfig.categories,
\t\t\t\t\tpage: \`\${window.location.protocol}//\${window.location.host}\${window.location.pathname}\`,
\t\t\t\t\tref: document.referrer,
\t\t\t\t\tmobile: ortbSiteConfig.mobile,
\t\t\t\t\tprivacypolicy: ortbSiteConfig.privacyPolicy,
\t\t\t\t\tpublisher: {
\t\t\t\t\t\tname: ortbSiteConfig.publisher.name,
\t\t\t\t\t\tdomain: ortbSiteConfig.publisher.domain,
\t\t\t\t\t\tcat: ortbSiteConfig.publisher.categories,
\t\t\t\t\t},
\t\t\t\t\tcontent: {
\t\t\t\t\t\tlanguage: window.userCookie?.lang?.substring(0, 2),
\t\t\t\t\t\ttitle: document.title,
\t\t\t\t\t\tkeywords: ortbSiteConfig.content.keywords,
\t\t\t\t\t\turl: \`\${window.location.protocol}//\${window.location.host}\${window.location.pathname}\`,
\t\t\t\t\t\tcat: ortbSiteConfig.content.categories,
\t\t\t\t\t\tprodq: parseInt(ortbSiteConfig.content.productQuality),
\t\t\t\t\t\tcontext: parseInt(ortbSiteConfig.content.context),
\t\t\t\t\t\tsourcerelationship: ortbSiteConfig.content.sourceRelationship,
\t\t\t\t\t\tdata: [{
\t\t\t\t\t\t\tname: ortbSiteConfig.content.data.name,
\t\t\t\t\t\t\text: ortbSiteConfig.content.data.extensions,
\t\t\t\t\t\t\tsegment: ortbSiteConfig.content.data.segments
\t\t\t\t\t\t}]
\t\t\t\t\t},
\t\t\t\t\tsectioncat: ortbSiteConfig.sectionCategories,
\t\t\t\t\tpagecat: ortbSiteConfig.pageCategories,
\t\t\t\t\tkeywords: ortbSiteConfig.keywords,
\t\t\t\t\text: {
\t\t\t\t\t\tdata: {},
\t\t\t\t\t},
\t\t\t\t};
\t\t\t}
\t\t\t(['advelvet', 'country', 'cuhd', 'cuhi', 'cuuv', 'cuwd', 'cuwx',
\t\t\t'dma', 'fdate', 'state', 'wx_seg', 'ufdb', 'alertscategory', 'alertssource',
\t\t\t'alertstypeid', 'site', 'realfeel']).forEach((key) => {
\t\t\t\tif (window.adInfo && window.adInfo[key]) {
\t\t\t\t\tortb2Site.ext.data[key] = window.adInfo[key].replaceAll('-', 'neg').split(',');
\t\t\t\t}
\t\t\t});
\t\t\t// Add ortb2.site.ext.data.bin_top and ortb2.site.ext.data.upr_top
\t\t\tif (window.serverAdsOnPageLite?.top) {
\t\t\t\tconst { upr, config } = window.serverAdsOnPageLite.top;
\t\t\t\tconst binTop = config.bids.find(bid => (bid.bidder === 'rubicon' && bid.isBuyItNow));
\t\t\t\tortb2Site.ext.data.bin_top = binTop?.params?.floor;
\t\t\t\tortb2Site.ext.data.upr_top = upr;
\t\t\t}

\t\t\t\t\tconst userSync = {
\t\t\t\t\t\tfilterSettings: {
\t\t\t\t\t\t\tiframe: {
\t\t\t\t\t\t\t\tbidders: '*',
\t\t\t\t\t\t\t\tfilter: 'include',
\t\t\t\t\t\t\t},
\t\t\t\t\t\t},
\t\t\t\t\t\tsyncsPerBidder: 0,
\t\t\t\t\t\taliasSyncEnabled: true,
\t\t\t\t\t\tsyncDelay: 6000,
\t\t\t\t\t\tuserIds: [
\t\t\t\t\t\t\t{
\t\t\t\t\t\t\t\tname: 'sharedId',
\t\t\t\t\t\t\t\tstorage: {
\t\t\t\t\t\t\t\t\ttype: 'cookie',
\t\t\t\t\t\t\t\t\tname: '_pubcid', // create a cookie with this name
\t\t\t\t\t\t\t\t\texpires: 30, // expires in 1 month
\t\t\t\t\t\t\t\t},
\t\t\t\t\t\t\t},
\t\t\t\t\t\t\t{
\t\t\t\t\t\t\t\tname: 'criteo',
\t\t\t\t\t\t\t},
\t\t\t\t\t\t\t{
\t\t\t\t\t\t\t\tname: 'merkleId',
\t\t\t\t\t\t\t\tparams: {
\t\t\t\t\t\t\t\t\tvendor: 'idsv2',
\t\t\t\t\t\t\t\t\tsv_cid: '5344_04531',
\t\t\t\t\t\t\t\t\tsv_pubid: '12562',
\t\t\t\t\t\t\t\t\tsv_domain: 'accuweather.com',
\t\t\t\t\t\t\t\t\tendpoint: 'https://id2.sv.rkdms.com/identity/',
\t\t\t\t\t\t\t\t\tssp_ids: ['534404531'],

\t\t\t\t\t\t\t\t},
\t\t\t\t\t\t\t\tstorage: {
\t\t\t\t\t\t\t\t\ttype: 'html5',
\t\t\t\t\t\t\t\t\tname: 'merkleId',
\t\t\t\t\t\t\t\t\texpires: 30,
\t\t\t\t\t\t\t\t},
\t\t\t\t\t\t\t},
\t\t\t\t\t\t\t{
\t\t\t\t\t\t\t\tname: 'pubProvidedId',
\t\t\t\t\t\t\t\tparams: {
\t\t\t\t\t\t\t\t\teids: [
\t\t\t\t\t\t\t\t\t\t{
\t\t\t\t\t\t\t\t\t\t\tsource: \\"accuweather.com\\",
\t\t\t\t\t\t\t\t\t\t\tuids: [
\t\t\t\t\t\t\t\t\t\t\t{
\t\t\t\t\t\t\t\t\t\t\tid: 'b292ff24a7bf4fffb9b5ee4da18c7328',
\t\t\t\t\t\t\t\t\t\t\tatype: 1,
\t\t\t\t\t\t\t\t\t\t\text: {stype: \\"ppuid\\"}
\t\t\t\t\t\t\t\t\t\t\t},
\t\t\t\t\t\t\t\t\t\t\t],
\t\t\t\t\t\t\t\t\t\t}
\t\t\t\t\t\t\t\t\t]
\t\t\t\t\t\t\t\t}
\t\t\t\t\t\t\t},
\t\t\t\t\t\t\t{
\t\t\t\t\t\t\t\tname: \\"33acrossId\\",
\t\t\t\t\t\t\t\tparams: {
\t\t\t\t\t\t\t\t\tpid: \\"0014000000xvF2DAAU\\"
\t\t\t\t\t\t\t\t},
\t\t\t\t\t\t\t\tstorage: {
\t\t\t\t\t\t\t\t\tname: \\"33acrossId\\",
\t\t\t\t\t\t\t\t\ttype: \\"html5\\",
\t\t\t\t\t\t\t\t\texpires: 90,
\t\t\t\t\t\t\t\t\trefreshInSeconds: 8 * 3600
\t\t\t\t\t\t\t\t}
\t\t\t\t\t\t\t},
\t\t\t\t\t\t\t{
\t\t\t\t\t\t\t\tname: 'unifiedId',
\t\t\t\t\t\t\t\tparams: {
\t\t\t\t\t\t\t\t\tpartner: 'vtlti0n'
\t\t\t\t\t\t\t\t},
\t\t\t\t\t\t\t},
\t\t\t\t\t\t],
\t\t\t\t\t};
\t\t\t\t\t\t\tconst config = {
\t\t\t\tbidderTimeout: window.BIDDING_TIMEOUT,
\t\t\t\tenableSendAllBids: false,
\t\t\t\tdisableAjaxTimeout: true,
\t\t\t\tmaxRequestsPerOrigin: 6,
\t\t\t\tenableTIDs: true,
\t\t\t\tbidderSequence: 'fixed',
\t\t\t\tpriceGranularity: {
\t\t\t\t\tbuckets: [
\t\t\t\t\t\t{
\t\t\t\t\t\t\tprecision: 2,
\t\t\t\t\t\t\tmax: 3,
\t\t\t\t\t\t\tincrement: 0.01,
\t\t\t\t\t\t},
\t\t\t\t\t\t{
\t\t\t\t\t\t\tprecision: 2,
\t\t\t\t\t\t\tmax: 8,
\t\t\t\t\t\t\tincrement: 0.05,
\t\t\t\t\t\t},
\t\t\t\t\t\t{
\t\t\t\t\t\t\tprecision: 2,
\t\t\t\t\t\t\tmax: 20,
\t\t\t\t\t\t\tincrement: 0.5,
\t\t\t\t\t\t},
\t\t\t\t\t\t{
\t\t\t\t\t\t\tprecision: 2,
\t\t\t\t\t\t\tmax: 100,
\t\t\t\t\t\t\tincrement: 1,
\t\t\t\t\t\t},
\t\t\t\t\t],
\t\t\t\t},
\t\t\t\tuserSync: userSync,
\t\t\t\tdeviceAccess: true,
\t\t\t\tcache: {
\t\t\t\t\turl: 'https://prebid.adnxs.com/pbc/v1/cache',
\t\t\t\t},
\t\t\t\tconsentManagement: {
\t\t\t\t\tusp: {
\t\t\t\t\t\tcmpApi: 'static',
\t\t\t\t\t\tconsentData: {
\t\t\t\t\t\t\tgetUSPData: {
\t\t\t\t\t\t\t\tuspString: '1YNN',
\t\t\t\t\t\t\t},
\t\t\t\t\t\t},
\t\t\t\t\t},
\t\t\t\t},
\t\t\t\trubicon: {
\t\t\t\t\tsingleRequest: true,
\t\t\t\t},
\t\t\t\tyahoossp: {
\t\t\t\t\tendpoint: 'https://c2shb.ssp.yahoo.com/bidRequest',
\t\t\t\t\tsingleRequestMode: true
\t\t\t\t},
\t\t\t\tuseBidCache: true,
\t\t\t\tbidCacheFilterFunction: bid => bid.mediaType !== 'video',
\t\t\t\ttimeoutBuffer: 0,
\t\t\t\tortb2: {
\t\t\t\t\tsite: ortb2Site,
\t\t\t\t\tuser: {
\t\t\t\t\t\text: ortb2User,
\t\t\t\t\t\tgeo: ortb2Geo,
\t\t\t\t\t},
\t\t\t\t},
\t\t\t};
\t\t\tif (window.isUserCountryEEA) {
\t\t\t\tconfig.consentManagement = {
\t\t\t\t\tgdpr: {
\t\t\t\t\t\tcmpApi: 'iab',
\t\t\t\t\t\tdefaultGdprScope: true,
\t\t\t\t\t\ttimeout: 0,
\t\t\t\t\t},
\t\t\t\t};
\t\t\t}
\t\t\tpbjs.setConfig(config);
\t\t\tpbjs.bidderSettings = {
\t\t\t\tstandard: {
\t\t\t\t\tstorageAllowed: true,
\t\t\t\t},
\t\t\t\tpubmatic: {
\t\t\t\t\tbidCpmAdjustment(bidCpm) {
\t\t\t\t\t\treturn bidCpm * (1 - 0.15);
\t\t\t\t\t},
\t\t\t\t},
\t\t\t};
\t\t\t// Create and push pbjs ad units
\t\t\tconst ALLOWED_SIZES = {
\t\t\t\ttop: ['300x250', '320x50', '300x50', '336x280', '728x90', '970x250', '970x90'],
\t\t\t\ttop_right: ['300x250', '300x600', '160x600'],
\t\t\t\tbottom_right: ['300x250', '300x600', '160x600'],
\t\t\t\tbottom: ['300x250', '320x50', '300x50', '300x600', '336x280', '728x90', '970x250', '970x90'],
\t\t\t\tadhesion: ['320x50', '300x50'],
\t\t\t\tmiddle: ['300x250', '320x50', '300x50', '300x600', '336x280'],
\t\t\t\tnative: ['1x1', '2x2', '300x250'],
\t\t\t\tinfeed: ['1x1', '2x2'],
\t\t\t};
\t\t\t(Object.keys(window.serverAdsOnPageLite) || []).forEach((key) => {
\t\t\t\tconst { adUnitCode, adType, config = {} } = window.serverAdsOnPageLite[key];
\t\t\t\tlet { responsiveSizes = [], bids = [], sizes = [] } = config;
\t\t\t\t// Only add pbjs ad unit if we have bids for the ad slot
\t\t\t\tif (bids.length) {
\t\t\t\t\t// If responsiveSizes are defined, use it for sizes
\t\t\t\t\tresponsiveSizes.forEach(respSize => {
\t\t\t\t\t\tif (sizes.length === 0 && document.documentElement.clientWidth >= respSize.window[0]) {
\t\t\t\t\t\t\tsizes = respSize.sizes;
\t\t\t\t\t\t}
\t\t\t\t\t});
\t\t\t\t\tconst filteredSizes = sizes.filter((size) => {
\t\t\t\t\t\tconst allowedSizes = ALLOWED_SIZES[adType] || [];
\t\t\t\t\t\treturn Array.isArray(size) && allowedSizes.indexOf(size.join('x')) > -1;
\t\t\t\t\t});

\t\t\t\t\t// ONE-279: Remove buy it now bids when initial ad load is not disabled
\t\t\t\t\tif (window.globalAdConfig && !window.globalAdConfig.disableInitialAdLoad) {
\t\t\t\t\t\tbids = bids.filter((bid) => !bid.isBuyItNow);
\t\t\t\t\t}

\t\t\t\t\tconst userData = window.userData;
\t\t\t\t\tif (userData?.countryCode?.toLowerCase() !== 'us') {
\t\t\t\t\t\tbids = bids.filter((bid) => bid.bidder !== 'yahoossp');
\t\t\t\t\t}


\t\t\t\t\tconst mediaTypes = {
\t\t\t\t\t\tbanner: {
\t\t\t\t\t\t\tsizes: filteredSizes,
\t\t\t\t\t\t},
\t\t\t\t\t};
\t\t\t\t\tif (adType === 'native' || adType === 'infeed') {
\t\t\t\t\t\tmediaTypes.native = {
\t\t\t\t\t\t\ttype: 'image',
\t\t\t\t\t\t};
\t\t\t\t\t}
\t\t\t\t\tpbjs.addAdUnits({
\t\t\t\t\t\tbids,
\t\t\t\t\t\tmediaTypes,
\t\t\t\t\t\tcode: adUnitCode,
\t\t\t\t\t\tortb2Imp: { ext: { data: { pbadslot: adUnitCode }, gpid: adUnitCode }},
\t\t\t\t\t});
\t\t\t\t}
\t\t\t});
\t\t});
\t\t// Prebid fetch promise
\t\tconst fetchPrebidBids = (adUnitCodes = []) => {
\t\t\tlet IS_BID_REQUESTED = false;
\t\t\treturn new Promise((resolve) => {
\t\t\t\tconst requestBids = () => {
\t\t\t\t\tif (IS_BID_REQUESTED) {
\t\t\t\t\t\treturn resolve();
\t\t\t\t\t}
\t\t\t\t\tIS_BID_REQUESTED = true;
\t\t\t\t\twindow.measureTiming('AdManager_RequestAllBids');
\t\t\t\t\ttry {
\t\t\t\t\t\tpbjs.requestBids({
\t\t\t\t\t\t\tadUnitCodes,
\t\t\t\t\t\t\ttimeout: window.BIDDING_TIMEOUT,
\t\t\t\t\t\t\tbidsBackHandler: (prebidBids) => {
\t\t\t\t\t\t\t\tresolve(prebidBids);
\t\t\t\t\t\t\t},
\t\t\t\t\t\t});
\t\t\t\t\t} catch (error) {
\t\t\t\t\t\tconsole.warn('Ad manager: error pbjs.requestBids', error);
\t\t\t\t\t\tresolve();
\t\t\t\t\t}
\t\t\t\t};
\t\t\t\tpbjs.que.push(() => {
\t\t\t\t\t// If user is in EEA, we will need to wait for consent before requesting bids
\t\t\t\t\tif (window.isUserCountryEEA) {
\t\t\t\t\t\t// If we already have cached consent, go ahead and request bids
\t\t\t\t\t\tif (window.fcConsentCookie.length > 0) {
\t\t\t\t\t\t\t// Setup tcfapi stub and return cached data
\t\t\t\t\t\t\twindow.__tcfapi = (command, version, callback) => {
\t\t\t\t\t\t\t\tconst tcData = JSON.parse(localStorage.getItem('awxTcData') || '{}');
\t\t\t\t\t\t\t\tif (tcData.tcString) {
\t\t\t\t\t\t\t\t\tswitch (command) {
\t\t\t\t\t\t\t\t\t\tcase 'addEventListener':
\t\t\t\t\t\t\t\t\t\tcase 'getTCData':
\t\t\t\t\t\t\t\t\t\t\tif (typeof callback === 'function') {
\t\t\t\t\t\t\t\t\t\t\tcallback(tcData, true);
\t\t\t\t\t\t\t\t\t\t\t}
\t\t\t\t\t\t\t\t\t\t\tbreak;
\t\t\t\t\t\t\t\t\t}
\t\t\t\t\t\t\t\t} else {
\t\t\t\t\t\t\t\t\t// delete consent cookie if something is wrong with tcData
\t\t\t\t\t\t\t\t\tdocument.cookie = 'awxconsent=; Max-Age=0; path=/';
\t\t\t\t\t\t\t\t}
\t\t\t\t\t\t\t};
\t\t\t\t\t\t\trequestBids();
\t\t\t\t\t\t}
\t\t\t\t\t\t// Else, we wait for consent response first
\t\t\t\t\t\telse if (window.googlefc) {
\t\t\t\t\t\t\t// When we have consent data, cache the response and then request the bids
\t\t\t\t\t\t\tconst onConsentReady = () => {
\t\t\t\t\t\t\t\tif (window.__tcfapi) {
\t\t\t\t\t\t\t\t\twindow.__tcfapi('addEventListener', 2, (tcData, success) => {
\t\t\t\t\t\t\t\t\t\tconst shouldSaveTCData = tcData && tcData.tcString && (tcData.gdprApplies === false || tcData.eventStatus === 'tcloaded' || tcData.eventStatus === 'useractioncomplete');
\t\t\t\t\t\t\t\t\t\tif (success && shouldSaveTCData) {
\t\t\t\t\t\t\t\t\t\t\tlocalStorage.setItem('awxTcData', JSON.stringify(tcData));
\t\t\t\t\t\t\t\t\t\t\t// Set first party cookie for 30 days
\t\t\t\t\t\t\t\t\t\t\tconst date = new Date();
\t\t\t\t\t\t\t\t\t\t\tdate.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));

\t\t\t\t\t\t\t\t\t\t\t// Check that user consented to purpose 1
\t\t\t\t\t\t\t\t\t\t\tconst consent = tcData.purpose && tcData.purpose.consents && tcData.purpose.consents['1'];
\t\t\t\t\t\t\t\t\t\t\tdocument.cookie = \`awxconsent=\${+consent}; expires=\${date.toUTCString()}; path=/\`;
\t\t\t\t\t\t\t\t\t\t}
\t\t\t\t\t\t\t\t\t});
\t\t\t\t\t\t\t\t}
\t\t\t\t\t\t\t\trequestBids();
\t\t\t\t\t\t\t};
\t\t\t\t\t\t\twindow.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
\t\t\t\t\t\t\twindow.googlefc.callbackQueue.push({
\t\t\t\t\t\t\t\tCONSENT_DATA_READY: onConsentReady,
\t\t\t\t\t\t\t});
\t\t\t\t\t\t\tsetTimeout(requestBids, 9000);
\t\t\t\t\t\t}
\t\t\t\t\t} else {
\t\t\t\t\t\trequestBids();
\t\t\t\t\t}
\t\t\t\t});
\t\t\t});
\t\t};
\t\twindow.renderPrebidWithIframe = (adObject, bid) => {
\t\t\tconst adDivEl = document.getElementById(adObject.adDivId);
\t\t\tadDivEl.innerHTML = '';
\t\t\tconst isNotForSafeFrame = bid.width <= 2 || bid.height <= 2;

\t\t\tconst iframe = document.createElement('iframe');

\t\t\tif (!isNotForSafeFrame) {
\t\t\t\tiframe.setAttribute(
\t\t\t\t\t'src',
\t\t\t\t\t'https://www.awxcdn.com/safeframe/1-0-0/html/container.html'
\t\t\t\t);
\t\t\t\tiframe.setAttribute('name', bid.adId);
\t\t\t\tiframe.setAttribute(
\t\t\t\t\t'sandbox',
\t\t\t\t\t'allow-forms allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation'
\t\t\t\t);
\t\t\t\tiframe.setAttribute('height', bid.height);
\t\t\t\tiframe.setAttribute('width', bid.width);
\t\t\t}
\t\t\tiframe.setAttribute('style', 'display:block;margin:auto');
\t\t\tiframe.setAttribute('frameborder', 0);
\t\t\tiframe.setAttribute('scrolling', 'no');
\t\t\tiframe.setAttribute('marginheight', 0);
\t\t\tiframe.setAttribute('marginwidth', 0);
\t\t\tiframe.setAttribute('TOPMARGIN', 0);
\t\t\tiframe.setAttribute('LEFTMARGIN', 0);
\t\t\tiframe.setAttribute('allowtransparency', 'true');
\t\t\tadDivEl.appendChild(iframe);
\t\t\tif (isNotForSafeFrame) {
\t\t\t\tpbjs.renderAd(iframe.contentWindow.document, bid.adId);
\t\t\t}
\t\t};
\t</script>
\t<script>

\t\t\t\twindow.prebidTimeoutPromise = new Promise((resolve) => {
\t\t\t\t\tpbjs.que.push(() => {
\t\t\t\t\t\tpbjs.onEvent('auctionInit', () => {
\t\t\t\t\t\t\tsetTimeout(resolve, window.BIDDING_TIMEOUT);
\t\t\t\t\t\t});
\t\t\t\t\t});
\t\t\t\t});
\t\t\t\tconst buyItNowBids = [];
\t\t\t\tpbjs.que.push(() => {
\t\t\t\t\tpbjs.onEvent('auctionInit', (auction) => {
\t\t\t\t\t\tauction.bidderRequests.forEach((bidder) => {
\t\t\t\t\t\t\tbidder.bids.forEach((bid) => {
\t\t\t\t\t\t\t\tif (bid.isBuyItNow) {
\t\t\t\t\t\t\t\t\tbuyItNowBids.push(bid.bidId);
\t\t\t\t\t\t\t\t}
\t\t\t\t\t\t\t});
\t\t\t\t\t\t});
\t\t\t\t\t});
\t\t\t\t});
\t\t\t\t// If GPT lazy load is enabled and page has repeating ad units, only run auction for slots before second repeating unit
\t\t\t\tlet adUnitCodesToFetch = [];
\t\t\t\twindow.initialAdDivIdsAuction = [];
\t\t\t\tif (window.globalAdConfig?.lazyLoadingData && window.pageHasRepeatAds) {
\t\t\t\t\tfor (const [adId, adObject] of adsOnPage.entries()) {
\t\t\t\t\t\tadUnitCodesToFetch.push(adObject.adUnitCode);
\t\t\t\t\t\twindow.initialAdDivIdsAuction.push(adObject.adDivId);
\t\t\t\t\t\tif (adObject.isRepeat) {
\t\t\t\t\t\t\tbreak;
\t\t\t\t\t\t}
\t\t\t\t\t}
\t\t\t\t}
\t\t\t\twindow.prebidBidPromise = fetchPrebidBids(adUnitCodesToFetch);
\t\t\t\t\t// Ad results object
\t\tconst prevAdResults = JSON.parse(localStorage.getItem('adResults'));
\t\tif (adInfo.pgview === '1' && prevAdResults) {
\t\t\tprevAdResults.previousRatio = prevAdResults.filledAds / prevAdResults.possibleAds;
\t\t\tprevAdResults.filledAds = 0;
\t\t\tprevAdResults.possibleAds = 0;
\t\t}
\t\twindow.adResults = prevAdResults || {};

\t\t// Start ad process
\t\twindow.googletag = window.googletag || { cmd: [] };
\t\tgoogletag.cmd.push(function() {
\t\t\twindow.measureTiming('GPT_Initialization');
\t\t\tif (!window.globalAdConfig || window.globalAdConfig.disableInitialAdLoad) {
\t\t\t\tgoogletag.pubads().disableInitialLoad();
\t\t\t}
\t\t\tgoogletag.pubads().enableAsyncRendering();
\t\t\tif (!window.globalAdConfig || window.globalAdConfig.enableSingleRequest) {
\t\t\t\tgoogletag.pubads().enableSingleRequest();
\t\t\t}
\t\t\tgoogletag.pubads().setCentering(true);
\t\t\tgoogletag.pubads().setSafeFrameConfig({
\t\t\t\tallowOverlayExpansion: false,
\t\t\t\tallowPushExpansion: true,
\t\t\t\tsandbox: true,
\t\t\t});
\t\t\t// Set page level targeting
\t\t\tfor (const [key, value] of Object.entries(adInfo)) {
\t\t\t\tif (value) {
\t\t\t\t\tgoogletag.pubads().setTargeting(key, value);
\t\t\t\t}
\t\t\t}
\t\t\t// Set privacy settings
\t\t\tif (adInfo.rdp === '1') {
\t\t\t\tgoogletag.pubads().setTargeting('optout', 'true');
\t\t\t\tgoogletag.pubads().setPrivacySettings({
\t\t\t\t\trestrictDataProcessing: true,
\t\t\t\t});
\t\t\t} else {
\t\t\t\t\tgoogletag.pubads().setTargeting('optout', 'false');
\t\t\t}
\t\t\t// Set ppid targeting
\t\t\tconst ppid = 'b292ff24a7bf4fffb9b5ee4da18c7328';
\t\t\tif (ppid) {
\t\t\t\tgoogletag.pubads().setPublisherProvidedId(ppid);
\t\t\t}

\t\t\t// Set location
\t\t\tif (window.userData && window.userData.zipCodes && window.userData.zipCodes.length > 0 && window.userData.countryCode.toLowerCase() === 'us') {
\t\t\t\tconst zip = window.userData.zipCodes[0].primary;
\t\t\t\tgoogletag.pubads().setLocation(\`\${zip},US\`);
\t\t\t}

\t\t\t// Init ad server
\t\t\tconst FAILSAFE_TIMEOUT = (window.globalAdConfig && typeof window.globalAdConfig.awxTimeout === 'number') ? window.globalAdConfig.awxTimeout : 10000;
\t\t\tlet IS_ADSERVER_INIT = false;
\t\t\tconst initAdserver = () => {
\t\t\t\tif (IS_ADSERVER_INIT) {
\t\t\t\t\treturn;
\t\t\t\t}
\t\t\t\tIS_ADSERVER_INIT = true;
\t\t\t\tmeasureTiming('AdManager_InitAdServer');
\t\t\t\t// Define ads in order
\t\t\t\tconst order = [\\"top\\",\\"top_right\\",\\"infeed\\",\\"bottom_right\\",\\"middle\\",\\"native\\",\\"bottom\\",\\"oop\\",\\"interstitial\\"];
\t\t\t\tconst orderedAds = Object.keys(window.serverAdsOnPageLite)
\t\t\t\t\t.sort((a, b) => order.indexOf(a.split('-')[0]) - order.indexOf(b.split('-')[0]))
\t\t\t\t\t.filter((adDivId) => order.indexOf(adDivId.split('-')[0]) > -1);
\t\t\t\tconst gptSlots = orderedAds.map((adDivId) => {
\t\t\t\t\tconst adsOnPage = window.serverAdsOnPageLite || {};
\t\t\t\t\tconst adObject = adsOnPage[adDivId];
\t\t\t\t\tif (adObject && document.getElementById(adObject.adDivId)) {
\t\t\t\t\t\t// Check if buy it now bids won
\t\t\t\t\t\tlet highestBid = { cpm: 0 };
\t\t\t\t\t\tif (pbjs?.getBidResponsesForAdUnitCode) {
\t\t\t\t\t\t\tconst bidResponses = pbjs.getBidResponsesForAdUnitCode(adObject.adUnitCode);
\t\t\t\t\t\t\t// Get the BuyItNow bid with highest cpm
\t\t\t\t\t\t\tbidResponses.bids.forEach((bid) => {
\t\t\t\t\t\t\t\tif (buyItNowBids.indexOf(bid.requestId) > -1 && bid.cpm > highestBid.cpm) {
\t\t\t\t\t\t\t\t\thighestBid = bid;
\t\t\t\t\t\t\t\t}
\t\t\t\t\t\t\t});
\t\t\t\t\t\t}
\t\t\t\t\t\t// If BuyItNow is valid, change the ad unit code geo part to bin_prebid
\t\t\t\t\t\t//  - then if skipGoogleAdManager is true, render the creative and create an oop ad unit for DFP tracking
\t\t\t\t\t\t//  - else, return the gptSlot with the new ad code
\t\t\t\t\t\t// otherwise return the gptSlot with the original ad code
\t\t\t\t\t\tlet isAdUnitPartOfInitialAuction = true;
\t\t\t\t\t\tif (window.globalAdConfig?.lazyLoadingData && window.pageHasRepeatAds && window.initialAdDivIdsAuction) {
\t\t\t\t\t\t\tisAdUnitPartOfInitialAuction = window.initialAdDivIdsAuction.includes(adObject.adDivId);
\t\t\t\t\t\t}
\t\t\t\t\t\tif (highestBid.cpm > 0 && isAdUnitPartOfInitialAuction) {
\t\t\t\t\t\t\tconst adCode = adObject.adUnitCode.split('/');
\t\t\t\t\t\t\tadCode[3] = 'bin_prebid';
\t\t\t\t\t\t\tadObject.code = adCode.join('/');
\t\t\t\t\t\t\t// Sets the pug page-level targeting
\t\t\t\t\t\t\tgoogletag.pubads().setTargeting('pug', '1');
\t\t\t\t\t\t\tif (!window.globalAdConfig || window.globalAdConfig.skipGoogleAdManager) {
\t\t\t\t\t\t\t\t// Mark winner.auction 1 if a buy it now bid wins
\t\t\t\t\t\t\t\tadObject.winner.auction = 1;

\t\t\t\t\t\t\t\twindow.renderPrebidWithIframe(adObject, highestBid);
\t\t\t\t\t\t\t\t// Create the bin_prebid tracking slot
\t\t\t\t\t\t\t\tconst oopId = \`\${adObject.adDivId}-oop\`;
\t\t\t\t\t\t\t\tconst oopDiv = document.createElement('div');
\t\t\t\t\t\t\t\toopDiv.setAttribute('id', oopId);
\t\t\t\t\t\t\t\toopDiv.setAttribute('class', 'tracking-slot');
\t\t\t\t\t\t\t\tdocument.body.appendChild(oopDiv);
\t\t\t\t\t\t\t\tconst gptSlot = googletag.defineOutOfPageSlot(adObject.code, oopId);
\t\t\t\t\t\t\t\tgptSlot?.addService(googletag.pubads());
\t\t\t\t\t\t\t\tObject.keys(highestBid.adserverTargeting).forEach((key) => {
\t\t\t\t\t\t\t\t\tgptSlot.setTargeting(key, highestBid.adserverTargeting[key]);
\t\t\t\t\t\t\t\t});
\t\t\t\t\t\t\t\tif (window.adInfo) {
\t\t\t\t\t\t\t\t\tif (window.adInfo.partner) {
\t\t\t\t\t\t\t\t\t\tgptSlot.setTargeting('partner', window.adInfo.partner);
\t\t\t\t\t\t\t\t\t}
\t\t\t\t\t\t\t\t\tgptSlot.setTargeting('userid3p', window.adInfo.userid3p);
\t\t\t\t\t\t\t\t}
\t\t\t\t\t\t\t\tadObject.gptSlot = gptSlot;
\t\t\t\t\t\t\t\treturn gptSlot;
\t\t\t\t\t\t\t}
\t\t\t\t\t\t}
\t\t\t\t\t\t// Get sizes from config
\t\t\t\t\t\tlet { sizes = [], responsiveSizes = [] } = adObject.config || {};
\t\t\t\t\t\tlet gptSlot;
\t\t\t\t\t\t// If responsiveSizes are defined, use it for sizes
\t\t\t\t\t\tconst platform = adObject.adUnitCode.split('/')[2];
\t\t\t\t\t\tresponsiveSizes.forEach(respSize => {
\t\t\t\t\t\t\t// Filter out sizes
\t\t\t\t\t\t\tif (adObject.adType === 'bottom' && (platform === 'ios' || platform === 'android')) {
\t\t\t\t\t\t\t\trespSize.sizes = respSize.sizes.filter(s => s.toString() !== '300,600');
\t\t\t\t\t\t\t}

\t\t\t\t\t\t\tif (sizes.length === 0 && document.documentElement.clientWidth >= respSize.window[0]) {
\t\t\t\t\t\t\t\tsizes = respSize.sizes;
\t\t\t\t\t\t\t}
\t\t\t\t\t\t});
\t\t\t\t\t\tif (adObject.adType === 'oop') {
\t\t\t\t\t\t\tgptSlot = googletag.defineOutOfPageSlot(adObject.adUnitCode, adObject.adDivId);
\t\t\t\t\t\t} else if (adObject.adType === 'interstitial') {
\t\t\t\t\t\t\tgptSlot = googletag.defineOutOfPageSlot(adObject.adUnitCode, googletag.enums.OutOfPageFormat.INTERSTITIAL);
\t\t\t\t\t\t} else {
\t\t\t\t\t\t\tgptSlot = googletag.defineSlot(adObject.adUnitCode, sizes, adObject.adDivId);
\t\t\t\t\t\t}
\t\t\t\t\t\tif (responsiveSizes && responsiveSizes.length > 0) {
\t\t\t\t\t\t\tconst mapping = googletag.sizeMapping();
\t\t\t\t\t\t\tresponsiveSizes.forEach((mapObject) => {
\t\t\t\t\t\t\t\tmapping.addSize(mapObject.window, mapObject.sizes);
\t\t\t\t\t\t\t});
\t\t\t\t\t\t\tgptSlot.defineSizeMapping(mapping.build());
\t\t\t\t\t\t}
\t\t\t\t\t\twindow.uprTargeting(gptSlot, adObject);
\t\t\t\t\t\tgptSlot?.addService(googletag.pubads());
\t\t\t\t\t\tadObject.gptSlot = gptSlot;
\t\t\t\t\t\t// Only return the gptSlot that's included in initial request
\t\t\t\t\t\tif (adObject.includeInSRA) {
\t\t\t\t\t\t\treturn gptSlot;
\t\t\t\t\t\t}
\t\t\t\t\t}
\t\t\t\t\treturn null;
\t\t\t\t}).filter((x) => x);
\t\t\t\tif (window.globalAdConfig?.lazyLoadingData) {
\t\t\t\t\tgoogletag.pubads().enableLazyLoad(window.globalAdConfig.lazyLoadingData);
\t\t\t\t}
\t\t\t\t// Enable services when all slots are defined
\t\t\t\tgoogletag.enableServices();
\t\t\t\t// Call display after services are enabled
\t\t\t\tgptSlots.forEach((gptSlot) => {
\t\t\t\t\tconst adDivId = gptSlot.getSlotElementId();
\t\t\t\t\twindow.measureTiming(\`AdManager_\${adDivId}_Display\`);
\t\t\t\t\tgoogletag.display(adDivId);
\t\t\t\t});
\t\t\t\t// Renders all ads on page
\t\t\t\twindow.pbjs?.setTargetingForGPTAsync && pbjs.setTargetingForGPTAsync();
\t\t\t\twindow.measureTiming('AdManager_SetTargetingForGPTAsync');
\t\t\t\tif (!window.globalAdConfig || window.globalAdConfig.disableInitialAdLoad) {
\t\t\t\t\tif (window.globalAdConfig && !window.globalAdConfig.enableSingleRequest) {
\t\t\t\t\t\tgptSlots.forEach((gptSlot) => {
\t\t\t\t\t\t\tgoogletag.pubads().refresh([gptSlot]);
\t\t\t\t\t\t});
\t\t\t\t\t} else {
\t\t\t\t\t\tgoogletag.pubads().refresh(gptSlots);
\t\t\t\t\t}
\t\t\t\t}
\t\t\t};

\t\t\t// If initial ad load is disabled, wait for prebid
\t\t\tif (!window.globalAdConfig || window.globalAdConfig.disableInitialAdLoad) {
\t\t\t\t// A timeout incase bidding fails or takes too long
\t\t\t\tsetTimeout(initAdserver, FAILSAFE_TIMEOUT);
\t\t\t\twindow.prebidBidPromise.then(initAdserver);
\t\t\t} else {
\t\t\t\tinitAdserver();
\t\t\t}
\t\t\tgoogletag.pubads().addEventListener('slotRenderEnded', (event) => {
\t\t\t\tif (document.body.classList.contains('ads-not-loaded')) {
\t\t\t\t\tsetTimeout(() => document.body.classList.remove('ads-not-loaded'), 750);
\t\t\t\t}
\t\t\t\tconst adSlot = window.serverAdsOnPageLite[event.slot.getSlotElementId()];
\t\t\t\tif (adSlot) {
\t\t\t\t\tconst renderedAdEl = document.getElementById(adSlot.adDivId);
\t\t\t\t\tif (renderedAdEl) {
\t\t\t\t\t\tsetTimeout(() => {
\t\t\t\t\t\t\trenderedAdEl.classList.remove('unrendered');
\t\t\t\t\t\t}, 250);
\t\t\t\t\t}
\t\t\t\t}
\t\t\t});
\t\t\tlet isInterstitialRendered = false;
\t\t\tgoogletag.pubads().addEventListener('slotResponseReceived', () => {
\t\t\t\tif (!isInterstitialRendered && window.serverAdsOnPageLite['interstitial']) {
\t\t\t\t\tisInterstitialRendered = true;
\t\t\t\t\tconst { gptSlot } = window.serverAdsOnPageLite['interstitial'];
\t\t\t\t\tif (gptSlot) {
\t\t\t\t\t\tgoogletag.display(gptSlot.getSlotElementId());
\t\t\t\t\t\tgoogletag.pubads().refresh([gptSlot]);
\t\t\t\t\t}
\t\t\t\t}
\t\t\t});
\t\t});
\t</script>

\t<script>
function getAwxSession(categories, pageId) {
\tconst AWX_SESSION_NAME = 'awx_session';
\tconst defaultVal = {
\t\tcategoryFlow: [],
\t\tvisitFlow: [],
\t\tttl: Date.now() + 600000
\t};

\tlet awxSession = JSON.parse(window.localStorage.getItem(AWX_SESSION_NAME) || '{}');
\tif (!awxSession.ttl || Date.now() > awxSession.ttl) {
\t\tawxSession = defaultVal;
\t}

\tif (categories) {
\t\tcategories = categories.toLowerCase().replace(/\\\\s/g, '-');
\t\tawxSession.categoryFlow = awxSession.categoryFlow.concat(categories.split('|')).slice(-30);
\t}

\tif (pageId) {
\t\tawxSession.visitFlow.push(pageId);
\t}

\ttry {
\t\twindow.localStorage.setItem(AWX_SESSION_NAME, JSON.stringify(awxSession));
\t} catch {};

\treturn {
\t\tcategoryFlow: awxSession.categoryFlow.join('/'),
\t\tvisitFlow: awxSession.visitFlow.join('/'),
\t\tvisitFlowArray: awxSession.visitFlow
\t};
}

function getUserContentAffinity(categories) {
\tconst storageKey = 'awxContentAffinity';
\tconst storageValue = window.localStorage.getItem(storageKey);
\tconst contentAffinity = (storageValue && storageValue !== '{}') ? JSON.parse(storageValue) : window.userCookie.userContentAffinity;

\tif (categories) {
\t\tcategories = categories.toLowerCase().replace(/\\\\s/g, '-');
\t\tcategories.split('|').forEach(function(category) {
\t\t\tcontentAffinity[category] = (contentAffinity[category] || 0) + 1;
\t\t});
\t}

\ttry {
\t\twindow.localStorage.setItem(storageKey, JSON.stringify(contentAffinity));
\t} catch {};

\treturn Object.keys(contentAffinity).map(function(category) {
\t\treturn category + ':' + contentAffinity[category];
\t}).join('/');
}
</script>

\t<script>
\tfunction getCampaignLongevity() {
\t\tvar inBrowser = typeof window !== 'undefined';
\t\tvar hasLocalStorage =
\t\t\tinBrowser &&
\t\t\t'localStorage' in window &&
\t\t\twindow.localStorage !== null &&
\t\t\ttypeof window.localStorage.setItem === 'function' &&
\t\t\ttypeof window.localStorage.getItem === 'function';

\t\tfunction getParamByName(name, url) {
\t\t\tif (!url) url = window.location.href;
\t\t\tname = name.replace(/[\\\\[\\\\]]/g, '\\\\\\\\$&');
\t\t\tvar regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
\t\t\tvar results = regex.exec(url);
\t\t\tif (!results) return null;
\t\t\tif (!results[2]) return '';
\t\t\treturn decodeURIComponent(results[2].replace(/\\\\+/g, ' '));
\t\t}

\t\tfunction getItem(name) {
\t\t\tvar value;

\t\t\tif (hasLocalStorage) {
\t\t\t\ttry {
\t\t\t\t\tvalue = window.localStorage.getItem(name);
\t\t\t\t} catch (err) {
\t\t\t\t\tconsole.error('Failed to read from local storage.', err);
\t\t\t\t}
\t\t\t} else {
\t\t\t\tvalue = getCookie(name);
\t\t\t}

\t\t\treturn value;
\t\t};

\t\tfunction setItem(name, value) {
\t\t\tvar valueAsString =
\t\t\t\ttypeof value === 'string' ? value : JSON.stringify(value);
\t\t\tif (hasLocalStorage) {
\t\t\t\ttry {
\t\t\t\t\twindow.localStorage.setItem(name, valueAsString);
\t\t\t\t\treturn true;
\t\t\t\t} catch (err) {
\t\t\t\t\tconsole.error('Failed to write to local storage.', err);
\t\t\t\t}
\t\t\t} else {
\t\t\t\t// Cookie fallback
\t\t\t\tsetCookie(name, valueAsString, 365);
\t\t\t}
\t\t};

\t\tfunction setCookie(name, value, days) {
\t\t\tvar expires = \\"\\";
\t\t\tif (days) {
\t\t\t\tvar date = new Date();
\t\t\t\tdate.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
\t\t\t\texpires = \\"; expires=\\" + date.toUTCString();
\t\t\t}
\t\t\tdocument.cookie = name + \\"=\\" + (value || \\"\\") + expires + \\"; path=/\\";
\t\t}

\t\tfunction getCookie(name) {
\t\t\tvar nameEQ = name + \\"=\\";
\t\t\tvar ca = document.cookie.split(';');
\t\t\tfor (var i = 0; i < ca.length; i++) {
\t\t\t\tvar c = ca[i];
\t\t\t\twhile (c.charAt(0) == ' ') c = c.substring(1, c.length);
\t\t\t\tif (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
\t\t\t}
\t\t\treturn null;
\t\t}

\t\tvar longevityCheckKey = 'utmCampaignCookie';
\t\tvar localUtmCampaign = getParamByName('utm_campaign');
\t\tvar longevityCheck = null;
\t\tif (!localUtmCampaign) {
\t\t\treturn null;
\t\t} else {
\t\t\tvar today = new Date();
\t\t\tvar todayEpoch = today.getTime();

\t\t\tvar campaignArray =
\t\t\t\tJSON.parse(getItem(longevityCheckKey)) || [];
\t\t\tvar localCampaign = campaignArray.filter(function (x) {
\t\t\t\treturn x.campaign === localUtmCampaign
\t\t\t})[0];
\t\t\tif (localCampaign) {
\t\t\t\tvar diff = todayEpoch - parseInt(localCampaign.dateAdded || 0);
\t\t\t\tvar diffDays = diff / (1000 * 3600 * 24);
\t\t\t\tif (diffDays < 1) {
\t\t\t\t\tdiffDays = 0;
\t\t\t\t}
\t\t\t\tlongevityCheck = diffDays;
\t\t\t} else {
\t\t\t\tcampaignArray.push({
\t\t\t\t\tcampaign: localUtmCampaign,
\t\t\t\t\tdateAdded: todayEpoch,
\t\t\t\t});
\t\t\t\tsetItem(longevityCheckKey, campaignArray.slice(0, 20));
\t\t\t\tlongevityCheck = 0;
\t\t\t}
\t\t\treturn Math.round(longevityCheck);
\t\t}
\t}
</script>

\t
\t
\t\t<script>
\t\t\twindow.dataLayer = window.dataLayer || [];
\t\t\tfunction gtag() { dataLayer.push(arguments); }
\t\t</script>
\t
\t
\t\t\t\t<link rel=\\"stylesheet\\" href=\\"https://www.awxcdn.com/adc-assets/bundles/city.current-weather-desktop.71f3dc648e94ffe53637.css\\" />
\t\t<link rel=\\"stylesheet\\" href=\\"https://www.awxcdn.com/adc-assets/bundles/3155.5bff36856386cdc6b03a.css\\" />
\t\t<link rel=\\"stylesheet\\" href=\\"https://www.awxcdn.com/adc-assets/bundles/8242.9de4e3b90ac95273ddb0.css\\" />

\t\t\t\t\t<link rel=\\"stylesheet\\" href=\\"https://www.awxcdn.com/adc-assets/bundles/legacy-header.b95dc28ff618a8b24d6a.css\\" />

\t
\t<script>
\t\twindow.cnx = window.cnx || {};
\t\twindow.cnx.cmd = window.cnx.cmd || [];
\t</script>
</head>

<body class=\\"current-weather ads-not-loaded    has-alerts full-animation rfphrase-disabled\\">
\t<div class=\\"template-root\\" style=\\"display:none\\">
\t\t\t<div class=\\"basic-header has-alerts  \\" style=\\"visibility: hidden;\\">

\t<a href=\\"/pwa\\" class=\\"pwa-top-banner\\">
\t\t<svg class=\\"arrow-icon\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#fff\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\tGo Back
\t</a>

\t

\t<div class=\\"alert-banner-container  \\">
\t<div id=\\"banner-wrap\\" class=\\"banner-wrap\\">
\t\t\t<div class=\\"alert-banner alert-banner-breaking\\">
\t<a class=\\"center\\" href=\\"https://www.accuweather.com/en/weather-forecasts/showers-storms-to-continue-in-southeast-but-will-hammer-2-main-areas/1671571\\" data-gatype=\\"breaking\\">
\t\t\t<svg xmlns=\\"http://www.w3.org/2000/svg\\" class=\\"icon-breaking-news\\" width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\"><path fill=\\"#FFF\\" fill-rule=\\"evenodd\\" d=\\"M1.9 13.176l5.912-3.413 1.75 3.031 2.946-6.897L5.062 5l1.75 3.031L.804 11.5A8 8 0 1 1 1.9 13.177z\\"/></svg>
\t\t<span>Days of drenching showers and storms to hammer Southeast this week. See the forecast</span>
\t\t<svg
\tclass=\\"icon-chevron right arrow\\"
\txmlns=\\"http://www.w3.org/2000/svg\\"
\twidth=\\"10\\"
\theight=\\"6\\"
\tviewBox=\\"0 0 10 6\\"
\trole=\\"img\\" 
\taria-labelledby=\\"chevronSVG\\"
>
\t<title id=\\"chevronSVG\\">Chevron right</title>
\t<path d=\\"M10 .969L9.037 0 5 4.063.963 0 0 .969 5 6z\\" />
</svg>

\t</a>
</div>

\t</div>
</div>


\t<div class=\\"header-outer\\">
\t\t<div class=\\"header-inner\\">
\t\t\t<a class=\\"header-logo\\" href=\\"/\\">
\t\t\t\t<svg data-eager xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"168\\" height=\\"24\\" viewBox=\\"0 0 189 27\\"><g fill=\\"none\\"><path fill=\\"#FFF\\" d=\\"M183.058 22.739v-6.864c0-1.4.293-2.342.879-2.83.585-.488 1.561-.716 2.863-.716h1.269v-3.09h-1.074c-.976 0-1.822.13-2.505.422a4.054 4.054 0 0 0-1.66 1.237l-.65-1.66h-2.44v13.5h3.318zM171.28 11.743c.944 0 1.66.26 2.148.814.488.553.748 1.268.813 2.147h-6.117c.065-.911.326-1.627.814-2.147.488-.553 1.204-.814 2.147-.814h.195zm2.766 6.93c-.228.487-.553.878-.976 1.138-.423.293-.944.423-1.627.423h-.228c-1.008 0-1.757-.293-2.277-.846-.52-.553-.814-1.301-.879-2.18h9.469v-1.366c0-2.114-.553-3.806-1.66-5.042-1.106-1.269-2.635-1.887-4.555-1.887h-.228c-1.92 0-3.449.618-4.588 1.887-1.138 1.236-1.692 2.863-1.692 4.847v.878c0 .976.163 1.855.456 2.668a5.877 5.877 0 0 0 1.269 2.082 5.83 5.83 0 0 0 2.017 1.366c.814.325 1.692.488 2.7.488h.229c1.269 0 2.342-.26 3.253-.748s1.66-1.236 2.213-2.245l-2.896-1.464zm-20.271 4.066v-7.873c.033-.91.26-1.659.716-2.244.455-.586 1.139-.879 1.985-.879h.325c.748 0 1.334.228 1.757.716.456.455.65 1.236.65 2.31v8.002h3.32v-8.588c0-1.594-.423-2.863-1.302-3.838-.878-.976-2.017-1.464-3.481-1.464h-.39c-.717 0-1.4.13-2.018.423a5.332 5.332 0 0 0-1.627 1.17V3.84h-3.319v18.9h3.384zm-8.688-2.96c-.227-.196-.325-.554-.325-1.074v-6.799h3.254V9.239h-3.254v-2.96h-2.83l-.359 2.96h-2.212v2.667h2.115v6.831c0 1.236.293 2.212.878 2.928.586.716 1.595 1.074 2.994 1.074h2.635V20.07h-1.92c-.455 0-.78-.098-.976-.293zm-13.828.52c-.683 0-1.204-.13-1.562-.39-.358-.26-.553-.651-.553-1.14v-.097c0-.488.195-.91.618-1.236.39-.325 1.106-.488 2.148-.488h2.472v.488c0 .976-.26 1.692-.78 2.147-.521.456-1.237.716-2.083.716h-.26zm-.65 2.797c.878 0 1.626-.162 2.31-.488.683-.325 1.236-.813 1.691-1.496l.553 1.66h2.506v-8.85c0-1.658-.488-2.927-1.464-3.773-.977-.845-2.343-1.268-4.068-1.268h-.325c-1.562 0-2.798.325-3.71.943-.91.65-1.496 1.431-1.756 2.342l2.928 1.204c.163-.456.456-.813.846-1.139.39-.292.944-.455 1.627-.455h.325c.781 0 1.367.195 1.725.553.39.39.553.91.553 1.594v.683h-2.408c-1.985 0-3.481.39-4.523 1.171-1.04.78-1.561 1.822-1.561 3.09v.196c0 1.268.39 2.244 1.17 2.992.782.716 1.888 1.106 3.32 1.106h.26v-.065zm-12.495-11.353c.943 0 1.659.26 2.147.814.488.553.748 1.268.813 2.147h-6.117c.065-.911.326-1.627.814-2.147.488-.553 1.204-.814 2.147-.814h.196zm2.765 6.93c-.228.487-.553.878-.976 1.138-.423.293-.943.423-1.627.423h-.228c-1.008 0-1.757-.293-2.277-.846-.52-.553-.814-1.301-.879-2.18h9.469v-1.366c0-2.114-.553-3.806-1.66-5.042-1.106-1.269-2.635-1.887-4.555-1.887h-.26c-1.92 0-3.45.618-4.588 1.887-1.139 1.236-1.692 2.863-1.692 4.847v.878c0 .976.163 1.855.455 2.668a5.877 5.877 0 0 0 1.27 2.082 5.83 5.83 0 0 0 2.017 1.366c.813.325 1.692.488 2.7.488h.228c1.27 0 2.343-.26 3.254-.748s1.66-1.236 2.213-2.245l-2.864-1.464zM95.76 22.738l3.97-13.76 3.774 13.76h3.026l5.434-18.673V3.84h-3.254l-3.58 13.37-3.513-13.37h-3.58L94.36 17.436 90.878 3.84h-3.416v.227l5.206 18.673h3.091zm-21.312-13.5v8.555c0 1.594.423 2.863 1.301 3.839.879.975 2.018 1.463 3.482 1.463h.358c.813 0 1.561-.162 2.212-.488.684-.325 1.237-.813 1.692-1.43l.553 1.56h2.473v-13.5h-3.286v7.873c-.033.91-.26 1.659-.748 2.244-.489.586-1.14.879-2.018.879h-.325c-.716 0-1.302-.228-1.757-.716-.456-.455-.684-1.236-.684-2.31V9.206h-3.253v.033zm-3.645.553c-.91-.586-2.082-.879-3.546-.879h-.228c-1.92 0-3.449.553-4.588 1.692-1.139 1.138-1.692 2.635-1.692 4.522v1.724c0 1.886.553 3.415 1.692 4.521 1.139 1.139 2.636 1.692 4.588 1.692h.228c1.334 0 2.44-.26 3.319-.78.878-.521 1.561-1.27 2.082-2.31l-2.733-1.53a3.17 3.17 0 0 1-.976 1.27c-.423.325-.976.487-1.692.487h-.228c-1.041 0-1.79-.325-2.278-.943-.488-.618-.715-1.431-.715-2.44V15.16c0-1.008.227-1.822.715-2.44.488-.618 1.237-.943 2.278-.943h.228c.716 0 1.301.163 1.724.488.423.325.749.78.976 1.334l2.864-1.367c-.423-1.008-1.107-1.854-2.018-2.44zm-13.308 0c-.91-.586-2.082-.879-3.546-.879h-.228c-1.92 0-3.449.553-4.588 1.692-1.139 1.138-1.692 2.635-1.692 4.522v1.724c0 1.886.553 3.415 1.692 4.521 1.139 1.139 2.636 1.692 4.588 1.692h.228c1.334 0 2.44-.26 3.319-.78.878-.521 1.561-1.27 2.082-2.31l-2.733-1.53a3.17 3.17 0 0 1-.976 1.27c-.423.325-.976.487-1.692.487h-.228c-1.041 0-1.79-.325-2.278-.943-.488-.618-.715-1.431-.715-2.44V15.16c0-1.008.227-1.822.715-2.44.488-.618 1.237-.943 2.278-.943h.228c.716 0 1.301.163 1.724.488.423.325.749.78.976 1.334l2.864-1.367c-.456-1.008-1.106-1.854-2.018-2.44zM38.557 8.783l2.246 6.962H36.28l2.277-6.962zM36.963 3.84l-6.28 18.672v.228h3.287l1.301-3.937h6.54l1.27 3.937h3.448v-.228L40.25 3.839h-3.286z\\"/><path fill=\\"#F05514\\" d=\\"M13.438 22.771c-5.14 0-9.338-4.196-9.338-9.336 0-5.14 4.197-9.304 9.338-9.304 5.141 0 9.306 4.197 9.306 9.304 0 5.172-4.165 9.336-9.306 9.336zm13.438-9.369-3.058-2.765 1.236-3.936-4.035-.878-.878-4.034-3.937 1.269L13.406 0 10.64 3.058 6.703 1.822l-.879 4.033-4.034.879 1.269 3.936L0 13.467l3.059 2.766-1.237 3.936 4.035.878.878 4.034 3.937-1.269 2.799 3.058 2.765-3.058 3.937 1.236.879-4.034 4.035-.91-1.27-3.937 3.06-2.765z\\"/><path fill=\\"#F05514\\" d=\\"M7.549 7.58a8.328 8.328 0 0 1 11.779 0 8.323 8.323 0 0 1 0 11.775 8.328 8.328 0 0 1-11.78 0c-3.253-3.253-3.253-8.555 0-11.775\\"/></g></svg>
\t\t\t</a>

\t\t\t
\t\t\t\t<a class=\\"header-city-link\\" href=\\"/en/us/marina/93933/weather-forecast/337145\\">
\t\t\t\t\t<h1 class=\\"header-loc\\">Marina, CA</h1>
\t\t\t\t\t<span class=\\"header-temp\\">55&#xB0;<span class=\\"unit\\">F</span></span>
\t\t\t\t\t<svg class=\\"header-weather-icon\\" data-src=\\"/images/weathericons/1.svg\\" viewBox=\\"0 0 288 288\\" width=\\"27\\" height=\\"27\\"><g stroke=\\"#FF8700\\" stroke-width=\\"9.6\\" fill=\\"none\\" fill-rule=\\"evenodd\\"><path d=\\"M144 0v48M144 240v48M0 144h48M211.872 76.128l33.936-33.936M245.808 245.808l-33.936-33.936M76.128 76.128 42.192 42.192\\"/><circle cx=\\"144\\" cy=\\"144\\" r=\\"76.8\\"/><path d=\\"m76.128 211.872-33.936 33.936M240 144h48\\"/></g></svg>
\t\t\t\t</a>

\t\t\t\t
\t\t\t\t\t
\t\t\t\t
\t\t\t

\t\t\t<div class=\\"pull-right\\">
\t\t\t\t
\t\t\t\t\t
\t\t\t\t\t
\t\t\t\t\t\t
\t\t\t\t\t\t<div class=\\"header-search-bar search-bar\\">
\t<div class=\\"searchbar-inner\\">
\t\t<svg class=\\"icon-search\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\"><path transform=\\"translate(3 3)\\" d=\\"M7.186 13.554c-3.462 0-6.303-2.869-6.303-6.359C.883 3.681 3.724.837 7.186.837c3.437 0 6.278 2.844 6.278 6.358 0 3.49-2.865 6.359-6.278 6.359zm5.323-1.602a7.176 7.176 0 0 0 1.815-4.757c0-3.968-3.2-7.195-7.138-7.195C3.223 0 0 3.227 0 7.195c0 3.944 3.223 7.171 7.186 7.171a7.058 7.058 0 0 0 4.75-1.84L17.427 18l.573-.55-5.49-5.498z\\"/></svg>
\t\t<form class=\\"search-form\\" action=\\"/en/search-locations\\" method=\\"GET\\">
\t\t\t<input
\t\t\t\tname=\\"query\\"
\t\t\t\tclass=\\"search-input\\"
\t\t\t\ttype=\\"text\\"
\t\t\t\tplaceholder=\\"Address, City or Zip Code\\"
\t\t\t\tdata-placeholder=\\"Address, City or Zip Code\\"
\t\t\t\tdata-alternative-placeholder=\\"Search\\"
\t\t\t\tautocomplete=\\"off\\"
\t\t\t/>
\t\t</form>
\t\t<svg class=\\"clear-icon close-icon\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><g fill-rule=\\"evenodd\\" transform=\\"translate(-1 -1)\\"><rect width=\\"2\\" height=\\"24\\" x=\\"9\\" y=\\"-2\\" rx=\\"1\\" transform=\\"rotate(45 10 10)\\"/><rect width=\\"2\\" height=\\"24\\" x=\\"9\\" y=\\"-2\\" rx=\\"1\\" transform=\\"rotate(-45 10 10)\\"/></g></svg>
\t\t<div class=\\"search-options\\">
\t\t\t

<div class=\\"dropdown-legacy left-bar\\">
\t<div class=\\"displayed-item\\">
\t\t<span>
\t\t\tLocation
\t\t</span>
\t\t<svg
\tclass=\\"icon-chevron  arrow\\"
\txmlns=\\"http://www.w3.org/2000/svg\\"
\twidth=\\"10\\"
\theight=\\"6\\"
\tviewBox=\\"0 0 10 6\\"
\trole=\\"img\\" 
\taria-labelledby=\\"chevronSVG\\"
>
\t<title id=\\"chevronSVG\\">Chevron down</title>
\t<path d=\\"M10 .969L9.037 0 5 4.063.963 0 0 .969 5 6z\\" />
</svg>

\t</div>
\t<div class=\\"items\\">
<a class=\\"item active\\" value=\\"/en/search-locations\\">
\t\t\t\t<span>Location</span>
\t\t\t\t<svg class=\\"item-icon icon-check\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" alt=\\"\\" viewBox=\\"0 0 24 24\\"><path d=\\"M7.832 17.496L2.142 11.9.205 13.792l7.627 7.503L24.205 5.188l-1.924-1.893z\\"/><use fill=\\"#000\\" fill-rule=\\"evenodd\\" /></svg>
\t\t\t</a>
<a class=\\"item\\" value=\\"/en/search-news\\">
\t\t\t\t<span>News</span>
\t\t\t\t<svg class=\\"item-icon icon-check\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" alt=\\"\\" viewBox=\\"0 0 24 24\\"><path d=\\"M7.832 17.496L2.142 11.9.205 13.792l7.627 7.503L24.205 5.188l-1.924-1.893z\\"/><use fill=\\"#000\\" fill-rule=\\"evenodd\\" /></svg>
\t\t\t</a>
<a class=\\"item\\" value=\\"/en/search-video\\">
\t\t\t\t<span>Videos</span>
\t\t\t\t<svg class=\\"item-icon icon-check\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" alt=\\"\\" viewBox=\\"0 0 24 24\\"><path d=\\"M7.832 17.496L2.142 11.9.205 13.792l7.627 7.503L24.205 5.188l-1.924-1.893z\\"/><use fill=\\"#000\\" fill-rule=\\"evenodd\\" /></svg>
\t\t\t</a>
\t</div>
</div>

\t\t</div>
\t</div>

\t<div class=\\"search-bar-dropdown\\">
\t\t<div class=\\"use-current-location\\">
\t\t\t<svg class=\\"icon-gps gps-icon\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"14\\" height=\\"16\\" viewBox=\\"0 0 14 16\\"><g id=\\"Symbols\\" fill=\\"#000\\" stroke=\\"none\\" stroke-width=\\"1\\" fill-rule=\\"evenodd\\" fill-opacity=\\"0.995941\\"><g id=\\"ICONS-/-Menu-/-GPS\\"><polygon id=\\"Triangle\\" transform=\\"translate(9.446152, 7.361216) rotate(-330.000000) translate(-9.446152, -7.361216) \\" points=\\"9.44615242 -1.13878407 15.4461524 15.8612159 9.44615242 12.4612159 3.44615242 15.8612159\\"></polygon></g></g></svg>
\t\t\t<span>Use Current Location</span>
\t\t</div>
\t\t
\t\t<div class=\\"recent-locations-dropdown\\">
\t\t\t<div class=\\"recent-title\\">Recent</div>
\t\t\t\t<a class=\\"recent-location\\" data-location-key=\\"337145\\" data-fetch=\\"false\\" href=\\"/web-api/three-day-redirect?key=337145&amp;target=\\">
\t\t\t\t\t<div class=\\"recent-location__title-wrapper\\">
\t\t\t\t\t\t<p class=\\"recent-location__name\\">Marina</p>
\t\t\t\t\t\t<p class=\\"recent-location__admin\\">California</p>
\t\t\t\t\t</div>
\t\t\t\t\t<svg class=\\"recent-location__icon\\" data-src=\\"/images/weathericons/1.svg\\" viewBox=\\"0 0 288 288\\" width=\\"32\\" height=\\"32\\"><g stroke=\\"#FF8700\\" stroke-width=\\"9.6\\" fill=\\"none\\" fill-rule=\\"evenodd\\"><path d=\\"M144 0v48M144 240v48M0 144h48M211.872 76.128l33.936-33.936M245.808 245.808l-33.936-33.936M76.128 76.128 42.192 42.192\\"/><circle cx=\\"144\\" cy=\\"144\\" r=\\"76.8\\"/><path d=\\"m76.128 211.872-33.936 33.936M240 144h48\\"/></g></svg>
\t\t\t\t\t<span class=\\"recent-location__temp\\">55&#xB0;</span>
\t\t\t\t</a>
\t\t</div>
\t\t<div class=\\"search-results\\">
\t\t\t<div class=\\"results-container\\"></div>
\t\t</div>
\t\t
\t\t<div class=\\"search-results no-search-result hidden\\">
\t\t\t<div class=\\"results-container\\">
\t\t\t\t<div class=\\"search-bar-result search-result no-result\\">
\t\t\t\t\t<div class=\\"no-result-headline\\">No results found.</div>
\t\t\t\t\t<div class=\\"no-result-text\\">Try searching for a city, zip code or point of interest.</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</div>
</div>

\t\t\t\t\t
\t\t\t\t\t<a href=\\"/en/videos\\" class=\\"video-wall-icon\\">
\t\t\t\t\t\t<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M17.0946 14.2044H0.75V1.5H17.0946V14.2044ZM16.2751 13.3847H1.56964V2.31948H16.2751V13.3847ZM7.4518 5.42938V10.2508L11.1643 7.8401L7.4518 5.42938ZM6.63216 3.91071L12.2491 7.55081V8.10528L6.63216 11.7696V3.91071Z\\" fill=\\"white\\"/><path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M4.82422 16.5884H13.0207V15.7687H4.82422V16.5884Z\\" fill=\\"white\\"/></svg>
\t\t\t\t\t</a>
\t\t\t\t\t
\t\t\t\t
\t\t\t\t<svg class=\\"hamburger-button icon-hamburger\\" data-qa=\\"navigationMenu\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 24 24\\">
                <defs>
                    <path id=\\"svghamburger\\" d=\\"M10 12v1H0v-1h10zm6-6v1H0V6h16zm0-6v1H0V0h16z\\"/>
                </defs>
                <use fill=\\"#FFF\\" fill-rule=\\"evenodd\\" transform=\\"matrix(-1 0 0 1 20 6)\\" xlink:href=\\"#svghamburger\\"/></svg>
\t\t\t\t<svg class=\\"close-button close-icon\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><g fill-rule=\\"evenodd\\" transform=\\"translate(-1 -1)\\"><rect width=\\"2\\" height=\\"24\\" x=\\"9\\" y=\\"-2\\" rx=\\"1\\" transform=\\"rotate(45 10 10)\\"/><rect width=\\"2\\" height=\\"24\\" x=\\"9\\" y=\\"-2\\" rx=\\"1\\" transform=\\"rotate(-45 10 10)\\"/></g></svg>
\t\t\t</div>
\t\t</div>
\t</div>

\t<div class=\\"header-menu\\">
\t\t
\t\t<div class=\\"settings-link\\">
\t\t\t<a href=\\"/en/settings\\">
\t\t\t\t<svg class=\\"icon-settings\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"25\\" viewBox=\\"0 0 24 25\\" fill=\\"#FFF\\"><path d=\\"M13.677.107l.871 2.674c.775.225 1.549.483 2.162.902l2.58-1.32 2.452 2.447-1.29 2.578c.354.612.645 1.353.87 2.094l2.678.902v3.414l-2.645.838c-.258.773-.549 1.578-.903 2.255l1.29 2.48-2.452 2.449-2.58-1.224c-.645.386-1.387.676-2.162.902l-.87 2.609h-3.42l-.903-2.61c-.742-.225-1.484-.482-2.161-.934L4.742 21.82 2.29 19.372l1.29-2.449c-.386-.676-.677-1.45-.903-2.255L0 13.798v-3.447l2.71-.902c.193-.74.451-1.481.87-2.094L2.29 4.843l2.452-2.449 2.452 1.289c.677-.387 1.419-.677 2.16-.902l.904-2.674h3.42zm-.838 1.128h-1.807l-.806 2.448-.549.193c-.677.194-1.354.419-1.935.773l-.548.29-2.29-1.16L3.58 5.1l1.225 2.384-.354.548c-.323.483-.581 1.127-.71 1.74l-.13.612-2.515.805v1.804l2.451.805.194.58c.193.677.42 1.385.774 1.965l.29.548-1.16 2.287L4.967 20.5l2.322-1.16.549.355c.58.354 1.226.612 1.903.773l.548.193.775 2.32h1.838l.774-2.417.581-.128c.677-.194 1.323-.42 1.903-.741l.484-.322 2.42 1.127 1.322-1.32-1.161-2.288.29-.483c.323-.645.58-1.353.774-2.062l.194-.58 2.42-.74V11.19l-2.452-.805-.194-.548c-.193-.677-.42-1.32-.742-1.836l-.29-.548 1.161-2.384-1.322-1.353-2.388 1.256-.548-.354a7.5 7.5 0 00-1.903-.74l-.58-.194-.807-2.448zm-.871 5.38c3.032 0 5.548 2.448 5.548 5.508 0 3.028-2.516 5.541-5.548 5.541-3.065 0-5.516-2.545-5.516-5.54a5.49 5.49 0 015.516-5.51zm0 1.063c-2.323 0-4.355 2.093-4.355 4.445 0 2.352 2.032 4.446 4.355 4.446 2.322 0 4.387-2.126 4.387-4.446 0-2.352-2.065-4.445-4.387-4.445z\\"/></svg>
\t\t\t\tsettings
\t\t\t</a>
\t\t\t
\t\t\t
\t\t\t\t<svg class=\\"close-button desktop-close close-icon\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><g fill-rule=\\"evenodd\\" transform=\\"translate(-1 -1)\\"><rect width=\\"2\\" height=\\"24\\" x=\\"9\\" y=\\"-2\\" rx=\\"1\\" transform=\\"rotate(45 10 10)\\"/><rect width=\\"2\\" height=\\"24\\" x=\\"9\\" y=\\"-2\\" rx=\\"1\\" transform=\\"rotate(-45 10 10)\\"/></g></svg>
\t\t\t
\t\t</div>
\t\t<div class=\\"header-loc-weather\\">Marina, CA Weather</div>
\t\t\t<a data-page-id=\\"three-day\\" data-ga-page-id=\\"today\\" class=\\"header-link \\" href=\\"/en/us/marina/93933/weather-forecast/337145\\">Today</a>
\t\t\t<a data-page-id=\\"wintercast\\" data-ga-page-id=\\"wintercast\\" class=\\"header-link nav-red-dot hidden winter-link \\" href=\\"/en/us/marina/93933/winter-weather-forecast/337145\\">WinterCast</a>
\t\t\t<a data-page-id=\\"tropical\\" data-ga-page-id=\\"local_{stormName}_tracker\\" class=\\"header-link nav-red-tropical-image northern side-item hidden tropical-link \\" href=\\"/en/us/marina/93933/tropical-weather-forecast/337145?eventkey={eventkey}\\">Local {stormName} Tracker</a>
\t\t\t<a data-page-id=\\"hourly\\" data-ga-page-id=\\"hourly\\" class=\\"header-link \\" href=\\"/en/us/marina/93933/hourly-weather-forecast/337145\\">Hourly</a>
\t\t\t<a data-page-id=\\"daily\\" data-ga-page-id=\\"daily\\" class=\\"header-link \\" href=\\"/en/us/marina/93933/daily-weather-forecast/337145\\">Daily</a>
\t\t\t<a data-page-id=\\"city-radar\\" data-ga-page-id=\\"radar\\" class=\\"header-link \\" href=\\"/en/us/marina/93933/weather-radar/337145\\">Radar</a>
\t\t\t<a data-page-id=\\"minutecast\\" data-ga-page-id=\\"minutecast\\" class=\\"header-link \\" href=\\"/en/us/marina/93933/minute-weather-forecast/337145\\">MinuteCast</a>
\t\t\t<a data-page-id=\\"monthly\\" data-ga-page-id=\\"monthly\\" class=\\"header-link \\" href=\\"/en/us/marina/93933/july-weather/337145\\">Monthly</a>
\t\t\t<a data-page-id=\\"air-quality\\" data-ga-page-id=\\"air_quality\\" class=\\"header-link \\" href=\\"/en/us/marina/93933/air-quality-index/337145\\">Air Quality</a>
\t\t\t<a data-page-id=\\"lifestyle-home\\" data-ga-page-id=\\"health_and_activities\\" class=\\"header-link \\" href=\\"/en/us/marina/93933/health-activities/337145\\">Health &amp; Activities</a>
\t\t
<div class=\\"more-cta-links \\">
\t<h2 class=\\"more-cta-title\\">
\t\t<p>Around the Globe</p>
\t</h2>
\t\t\t<a href=\\"/en/hurricane\\" class=\\"cta-link\\" data-page-id=\\"hurricane\\" data-ga-page-id=\\"hurricane_tracker\\">
\t\t\t\t<h3 class=\\"cta-text\\">Hurricane Tracker</h3>
\t\t\t\t<svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t</a>
\t\t\t<a href=\\"/en/us/severe-weather\\" class=\\"cta-link\\" data-page-id=\\"severe-weather\\" data-ga-page-id=\\"severe_weather\\">
\t\t\t\t<h3 class=\\"cta-text\\">Severe Weather</h3>
\t\t\t\t<svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t</a>
\t\t\t<a href=\\"/en/us/california/weather-radar\\" class=\\"cta-link\\" data-page-id=\\"map-radar\\" data-ga-page-id=\\"radar_and_maps\\">
\t\t\t\t<h3 class=\\"cta-text\\">Radar &amp; Maps</h3>
\t\t\t\t<svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t</a>
\t\t\t<div class=\\"sublink-container\\">
\t\t\t\t<div class=\\"sublink-header\\">
\t\t\t\t\t<div class=\\"sublink-title\\">News</div>
\t\t\t\t\t<svg class=\\"icon-chevron chevron-icon down\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"10\\" height=\\"6\\" viewBox=\\"0 0 10 6\\"><path d=\\"M10 .969L9.037 0 5 4.063.963 0 0 .969 5 6z\\" /></svg>
\t\t\t\t</div>
\t\t\t\t\t<a href=\\"/en/weather-news\\" class=\\"cta-link\\" data-page-id=\\"news\\" data-ga-page-id=\\"news_and_features\\">
\t\t\t\t\t\t<h3 class=\\"cta-text\\">News &amp; Features</h3>
\t\t\t\t\t\t<svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t\t\t</a>
\t\t\t\t\t<a href=\\"/en/space-news\\" class=\\"cta-link\\" data-page-id=\\"content-landing\\" data-ga-page-id=\\"astronomy\\">
\t\t\t\t\t\t<h3 class=\\"cta-text\\">Astronomy</h3>
\t\t\t\t\t\t<svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t\t\t</a>
\t\t\t\t\t<a href=\\"/en/business\\" class=\\"cta-link\\" data-page-id=\\"content-landing\\" data-ga-page-id=\\"business\\">
\t\t\t\t\t\t<h3 class=\\"cta-text\\">Business</h3>
\t\t\t\t\t\t<svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t\t\t</a>
\t\t\t\t\t<a href=\\"/en/climate\\" class=\\"cta-link\\" data-page-id=\\"content-landing\\" data-ga-page-id=\\"climate\\">
\t\t\t\t\t\t<h3 class=\\"cta-text\\">Climate</h3>
\t\t\t\t\t\t<svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t\t\t</a>
\t\t\t\t\t<a href=\\"/en/health-wellness\\" class=\\"cta-link\\" data-page-id=\\"content-landing\\" data-ga-page-id=\\"health\\">
\t\t\t\t\t\t<h3 class=\\"cta-text\\">Health</h3>
\t\t\t\t\t\t<svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t\t\t</a>
\t\t\t\t\t<a href=\\"/en/leisure-recreation\\" class=\\"cta-link\\" data-page-id=\\"content-landing\\" data-ga-page-id=\\"recreation\\">
\t\t\t\t\t\t<h3 class=\\"cta-text\\">Recreation</h3>
\t\t\t\t\t\t<svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t\t\t</a>
\t\t\t\t\t<a href=\\"/en/sports\\" class=\\"cta-link\\" data-page-id=\\"content-landing\\" data-ga-page-id=\\"sports\\">
\t\t\t\t\t\t<h3 class=\\"cta-text\\">Sports</h3>
\t\t\t\t\t\t<svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t\t\t</a>
\t\t\t\t\t<a href=\\"/en/travel\\" class=\\"cta-link\\" data-page-id=\\"content-landing\\" data-ga-page-id=\\"travel\\">
\t\t\t\t\t\t<h3 class=\\"cta-text\\">Travel</h3>
\t\t\t\t\t\t<svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t\t\t</a>
\t\t\t</div>
\t\t\t<a href=\\"/en/videos\\" class=\\"cta-link\\" data-page-id=\\"video-wall\\" data-ga-page-id=\\"video\\">
\t\t\t\t<h3 class=\\"cta-text\\">Video</h3>
\t\t\t\t<svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t</a>
\t\t\t<a href=\\"/en/us/winter-weather\\" class=\\"cta-link\\" data-page-id=\\"winter-weather\\" data-ga-page-id=\\"winter_center\\">
\t\t\t\t<h3 class=\\"cta-text\\">Winter Center</h3>
\t\t\t\t<svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t</a>
</div>

\t</div>
</div>
<div class=\\"header-placeholder has-alerts \\"></div>

\t<div class=\\"page-subnav\\">
\t\t
\t\t<div class=\\"subnav secondary-nav     \\" data-gatype=\\"city\\">
\t<div class=\\"overflow overflow-left\\" data-qa=\\"leftArrow\\">
\t\t<svg class=\\"arrow chevron-icon left\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"10\\" height=\\"6\\" viewBox=\\"0 0 10 6\\"><path d=\\"M10 .969L9.037 0 5 4.063.963 0 0 .969 5 6z\\" /></svg>
\t</div>
\t<div class=\\"overflow overflow-right\\" data-qa=\\"rightArrow\\">
\t\t<svg class=\\"arrow chevron-icon right\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"10\\" height=\\"6\\" viewBox=\\"0 0 10 6\\"><path d=\\"M10 .969L9.037 0 5 4.063.963 0 0 .969 5 6z\\" /></svg>
\t</div>
\t<div class=\\"subnav-items\\">
\t\t\t\t<a
\t\t\t\t\tclass=\\"subnav-item \\"
\t\t\t\t\thref=\\"/en/us/marina/93933/weather-forecast/337145\\"
\t\t\t\t\tdata-qa=\\"now\\"
\t\t\t\t\tdata-gaid=now
\t\t\t\t\tdata-pageid=\\"three-day\\"
\t\t\t\t>
\t\t\t\t\t\t<span>Today</span>
\t\t\t\t</a>
\t\t\t\t<a
\t\t\t\t\tclass=\\"subnav-item \\"
\t\t\t\t\thref=\\"/en/us/marina/93933/hourly-weather-forecast/337145\\"
\t\t\t\t\tdata-qa=\\"hourly\\"
\t\t\t\t\tdata-gaid=hourly
\t\t\t\t\tdata-pageid=\\"hourly\\"
\t\t\t\t>
\t\t\t\t\t\t<span>Hourly</span>
\t\t\t\t</a>
\t\t\t\t<a
\t\t\t\t\tclass=\\"subnav-item \\"
\t\t\t\t\thref=\\"/en/us/marina/93933/daily-weather-forecast/337145\\"
\t\t\t\t\tdata-qa=\\"daily\\"
\t\t\t\t\tdata-gaid=daily
\t\t\t\t\tdata-pageid=\\"daily\\"
\t\t\t\t>
\t\t\t\t\t\t<span>Daily</span>
\t\t\t\t</a>
\t\t\t\t<a
\t\t\t\t\tclass=\\"subnav-item \\"
\t\t\t\t\thref=\\"/en/us/marina/93933/weather-radar/337145\\"
\t\t\t\t\tdata-qa=\\"radar\\"
\t\t\t\t\tdata-gaid=radar
\t\t\t\t\tdata-pageid=\\"city-radar\\"
\t\t\t\t>
\t\t\t\t\t\t<span>Radar</span>
\t\t\t\t</a>
\t\t\t\t<a
\t\t\t\t\tclass=\\"subnav-item \\"
\t\t\t\t\thref=\\"/en/us/marina/93933/minute-weather-forecast/337145\\"
\t\t\t\t\tdata-qa=\\"minutecast\\"
\t\t\t\t\tdata-gaid=minutecast
\t\t\t\t\tdata-pageid=\\"minutecast\\"
\t\t\t\t>
\t\t\t\t\t\t<span>MinuteCast</span>
\t\t\t\t</a>
\t\t\t\t<a
\t\t\t\t\tclass=\\"subnav-item \\"
\t\t\t\t\thref=\\"/en/us/marina/93933/july-weather/337145\\"
\t\t\t\t\tdata-qa=\\"monthly\\"
\t\t\t\t\tdata-gaid=monthly
\t\t\t\t\tdata-pageid=\\"monthly\\"
\t\t\t\t>
\t\t\t\t\t\t<span>Monthly</span>
\t\t\t\t</a>
\t\t\t\t<a
\t\t\t\t\tclass=\\"subnav-item \\"
\t\t\t\t\thref=\\"/en/us/marina/93933/air-quality-index/337145\\"
\t\t\t\t\tdata-qa=\\"airQuality\\"
\t\t\t\t\tdata-gaid=airQuality
\t\t\t\t\tdata-pageid=\\"air-quality\\"
\t\t\t\t>
\t\t\t\t\t\t<span>Air Quality</span>
\t\t\t\t</a>
\t\t\t\t<a
\t\t\t\t\tclass=\\"subnav-item \\"
\t\t\t\t\thref=\\"/en/us/marina/93933/health-activities/337145\\"
\t\t\t\t\tdata-qa=\\"lifestyles\\"
\t\t\t\t\tdata-gaid=lifestyles
\t\t\t\t\tdata-pageid=\\"lifestyle-home\\"
\t\t\t\t>
\t\t\t\t\t\t<span>Health &amp; Activities</span>
\t\t\t\t</a>
\t\t\t\t<a
\t\t\t\t\tclass=\\"subnav-item \\"
\t\t\t\t\thref=\\"https://afb.accuweather.com\\"
\t\t\t\t\tdata-qa=\\"for-business\\"
\t\t\t\t\tdata-gaid=for-business
\t\t\t\t\tdata-pageid=\\"for-business\\"
\t\t\t\t>
\t\t\t\t\t\t<span>For Business</span>
\t\t\t\t</a>
\t\t<div class=\\"subnav-item filler\\"></div>
\t</div>
</div>





\t</div>
\t
\t\t<div class=\\"glacier-ad unrendered top config-top content-module\\" data-ad-type=\\"top\\" data-viewport=\\"tablet desktop\\" id=\\"top\\"></div>

\t
\t
\t\t<div class=\\"glacier-ad unrendered oop config-oop \\" data-ad-type=\\"oop\\" data-viewport=\\"\\" id=\\"oop\\"></div>

\t\t<div class=\\"glacier-ad unrendered interstitial config-interstitial \\" data-ad-type=\\"interstitial\\" data-viewport=\\"\\" id=\\"interstitial\\"></div>

\t
\t<div class=\\"two-column-page-content \\">
\t\t<div class=\\"page-column-1\\">
\t\t\t<div class=\\"page-content content-module\\">
\t\t\t\t
\t\t\t\t
\t<div class=\\"content-module subnav-pagination\\">
\t\t\t\t<a href=\\"\\" class=\\"hidden \\">
\t\t\t\t\t<svg class=\\"pagination-button chevron-icon left\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"10\\" height=\\"6\\" viewBox=\\"0 0 10 6\\"><path d=\\"M10 .969L9.037 0 5 4.063.963 0 0 .969 5 6z\\" /></svg>
\t\t\t\t</a>
\t\t\t\t<div>Tuesday, July 23</div>
\t\t\t\t<a href=\\"/en/us/marina/93933/weather-tomorrow/337145\\" class=\\" \\">
\t\t\t\t\t<svg class=\\"pagination-button chevron-icon right\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"10\\" height=\\"6\\" viewBox=\\"0 0 10 6\\"><path d=\\"M10 .969L9.037 0 5 4.063.963 0 0 .969 5 6z\\" /></svg>
\t\t\t\t</a>
\t\t\t</div>

\t


<div class=\\"current-weather-card card-module content-module \\">
\t<div class=\\"card-header spaced-content\\">
\t\t<h1>Current Weather</h1>
\t\t<p class=\\"sub\\">3:55 PM</p>
\t</div>

\t<div class=\\"card-content\\">
\t\t<div class=\\"current-weather\\">
\t\t\t<div class=\\"current-weather-info\\">
\t\t\t\t<svg class=\\"icon\\" data-src=\\"/images/weathericons/1.svg\\" viewBox=\\"0 0 288 288\\" width=\\"62\\" height=\\"62\\"><g stroke=\\"#FF8700\\" stroke-width=\\"9.6\\" fill=\\"none\\" fill-rule=\\"evenodd\\"><path d=\\"M144 0v48M144 240v48M0 144h48M211.872 76.128l33.936-33.936M245.808 245.808l-33.936-33.936M76.128 76.128 42.192 42.192\\"/><circle cx=\\"144\\" cy=\\"144\\" r=\\"76.8\\"/><path d=\\"m76.128 211.872-33.936 33.936M240 144h48\\"/></g></svg>
\t\t\t\t<div class=\\"temp\\">
\t\t\t\t\t<div class=\\"display-temp\\">55&#xB0;<span class=\\"sub\\">F</span>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class=\\"phrase\\">Sunny</div>
\t\t</div>
\t\t<div class=\\"current-weather-extra no-realfeel-phrase\\">
\t\t\t<div>
\t\t\t\tRealFeel&#xAE; 58&#xB0;
\t\t\t\t
<div class=\\"label-tooltip\\" data-js=\\"prevent-accordion-toggle\\">
\t<div class=\\"label clickable \\">Cool</div>
\t<div class=\\"label-tooltip-overlay \\">
\t\t<div class=\\"label-tooltip-header spaced-content\\">
\t\t\t<span>RealFeel Guide</span>
\t\t\t<svg class=\\"close-icon\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 18 18\\"><g fill-rule=\\"evenodd\\" transform=\\"translate(-1 -1)\\"><rect width=\\"2\\" height=\\"24\\" x=\\"9\\" y=\\"-2\\" rx=\\"1\\" transform=\\"rotate(45 10 10)\\"/><rect width=\\"2\\" height=\\"24\\" x=\\"9\\" y=\\"-2\\" rx=\\"1\\" transform=\\"rotate(-45 10 10)\\"/></g></svg>
\t\t</div>
\t\t<div class=\\"label-tooltip-content\\">
\t\t\t<div class=\\"label-tooltip-content__subtitle spaced-content\\">
\t\t\t\t<div>Cool</div>
\t\t\t\t<div class=\\"label-tooltip-content__reference\\">53&#xB0; to 62&#xB0;</div>
\t\t\t</div>
\t\t\t<div class=\\"label-tooltip-content__content\\">Light jacket or sweater may be appropriate.</div>
\t\t</div>
\t\t<a class=\\"label-tooltip-cta\\" href=\\"/en/realfeel-guide\\">LEARN MORE <svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"12\\" height=\\"12\\" viewBox=\\"0 0 12 12\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg></a>
\t</div>
</div>

\t\t\t</div>
\t\t\t<div class=\\"realfeel-shade-details\\">
\t\t\t\tRealFeel Shade™ 51&#xB0;
\t\t\t\t
<div class=\\"label-tooltip\\" data-js=\\"prevent-accordion-toggle\\">
\t<div class=\\"label clickable \\">Chilly</div>
\t<div class=\\"label-tooltip-overlay \\">
\t\t<div class=\\"label-tooltip-header spaced-content\\">
\t\t\t<span>RealFeel Guide</span>
\t\t\t<svg class=\\"close-icon\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 18 18\\"><g fill-rule=\\"evenodd\\" transform=\\"translate(-1 -1)\\"><rect width=\\"2\\" height=\\"24\\" x=\\"9\\" y=\\"-2\\" rx=\\"1\\" transform=\\"rotate(45 10 10)\\"/><rect width=\\"2\\" height=\\"24\\" x=\\"9\\" y=\\"-2\\" rx=\\"1\\" transform=\\"rotate(-45 10 10)\\"/></g></svg>
\t\t</div>
\t\t<div class=\\"label-tooltip-content\\">
\t\t\t<div class=\\"label-tooltip-content__subtitle spaced-content\\">
\t\t\t\t<div>Chilly</div>
\t\t\t\t<div class=\\"label-tooltip-content__reference\\">40&#xB0; to 52&#xB0;</div>
\t\t\t</div>
\t\t\t<div class=\\"label-tooltip-content__content\\">Jacket or sweater is recommended.</div>
\t\t</div>
\t\t<a class=\\"label-tooltip-cta\\" href=\\"/en/realfeel-guide\\">LEARN MORE <svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"12\\" height=\\"12\\" viewBox=\\"0 0 12 12\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg></a>
\t</div>
</div>

\t\t\t</div>
\t\t</div>
\t</div>

\t

\t<div class=\\"current-weather-details no-realfeel-phrase \\">
\t\t\t<div class=\\"detail-item spaced-content\\">
\t\t\t\t<div>RealFeel&#xAE;</div>
\t\t\t\t<div>58&#xB0;</div>
\t\t\t</div>
\t\t\t<div class=\\"detail-item spaced-content\\">
\t\t\t\t<div>RealFeel Shade&#x2122;</div>
\t\t\t\t<div>51&#xB0;</div>
\t\t\t</div>
\t\t\t<div class=\\"detail-item spaced-content\\">
\t\t\t\t<div>Max UV Index</div>
\t\t\t\t<div>5 Moderate</div>
\t\t\t</div>
\t\t\t<div class=\\"detail-item spaced-content\\">
\t\t\t\t<div>Wind</div>
\t\t\t\t<div>WNW 9 mph</div>
\t\t\t</div>
\t\t\t<div class=\\"detail-item spaced-content\\">
\t\t\t\t<div>Wind Gusts</div>
\t\t\t\t<div>11 mph</div>
\t\t\t</div>
\t\t\t<div class=\\"detail-item spaced-content\\">
\t\t\t\t<div>Humidity</div>
\t\t\t\t<div>88%</div>
\t\t\t</div>
\t\t\t<div class=\\"detail-item spaced-content\\">
\t\t\t\t<div>Indoor Humidity</div>
\t\t\t\t<div>56% (Ideal Humidity)</div>
\t\t\t</div>
\t\t\t<div class=\\"detail-item spaced-content\\">
\t\t\t\t<div>Dew Point</div>
\t\t\t\t<div>52&#xB0; F</div>
\t\t\t</div>
\t\t\t<div class=\\"detail-item spaced-content\\">
\t\t\t\t<div>Pressure</div>
\t\t\t\t<div>&#x2194; 29.95 in</div>
\t\t\t</div>
\t\t\t<div class=\\"detail-item spaced-content\\">
\t\t\t\t<div>Cloud Cover</div>
\t\t\t\t<div>0%</div>
\t\t\t</div>
\t\t\t<div class=\\"detail-item spaced-content\\">
\t\t\t\t<div>Visibility</div>
\t\t\t\t<div>10 mi</div>
\t\t\t</div>
\t\t\t<div class=\\"detail-item spaced-content\\">
\t\t\t\t<div>Cloud Ceiling</div>
\t\t\t\t<div>40000 ft</div>
\t\t\t</div>
\t</div>
</div>


\t<div class=\\"glacier-ad unrendered native config-native content-module\\" data-ad-type=\\"native\\" data-viewport=\\"\\" id=\\"native\\"></div>


\t\t
<div class=\\"half-day-card  content-module  \\">
\t<div class=\\"half-day-card-header\\">
\t\t<div class=\\"half-day-card-header__title\\">
\t\t\t<h2 class=\\"title\\">Day</h2>
\t\t\t<span class=\\"short-date\\">
\t\t\t\t7/23
\t\t\t</span>
\t\t</div>
\t\t<div class=\\"half-day-card-header__content\\">
\t\t\t<div class=\\"weather\\">
\t\t\t\t<svg class=\\"icon\\" data-src=\\"/images/weathericons/2.svg\\" viewBox=\\"0 0 288 288\\" width=\\"128\\" height=\\"128\\"><g stroke-width=\\"9.499\\" fill=\\"none\\" fill-rule=\\"evenodd\\"><path d=\\"M143.484 2v47.495M143.484 239.474v47.494M1 144.484h47.495M210.642 77.327l33.579-33.58M244.22 245.22l-33.578-33.578M76.327 77.327l-33.58-33.58M76.327 211.642l-33.58 33.579M211.877 111.57c-14.945-30.993-48.85-48.077-82.652-41.646-33.802 6.43-59.065 34.77-61.585 69.086-2.52 34.316 18.331 66.043 50.83 77.343 32.5 11.3 68.537-.647 87.85-29.124\\" stroke=\\"#FF8700\\"/><path d=\\"M250.3 125.486h-4.132a37.996 37.996 0 0 0-67.538 22.798h-6.079c-10.394.513-18.558 9.09-18.558 19.496 0 10.407 8.164 18.984 18.558 19.497H250.3a30.92 30.92 0 1 0 0-61.743v-.048Z\\" stroke=\\"#BABABA\\"/></g></svg>
\t\t\t\t<div class=\\"temperature\\">
\t\t\t\t\t60&#xB0;<span class=\\"hi-lo-label\\">Hi</span>
\t\t\t\t</div>
\t\t\t</div>

\t\t\t<div class=\\"real-feel\\">
\t\t\t\t<div>
\t\t\t\t\tRealFeel&#xAE;
\t\t\t\t\t68&#xB0;
\t\t\t\t\t
<div class=\\"label-tooltip\\" data-js=\\"prevent-accordion-toggle\\">
\t<div class=\\"label clickable \\">Pleasant</div>
\t<div class=\\"label-tooltip-overlay \\">
\t\t<div class=\\"label-tooltip-header spaced-content\\">
\t\t\t<span>RealFeel Guide</span>
\t\t\t<svg class=\\"close-icon\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 18 18\\"><g fill-rule=\\"evenodd\\" transform=\\"translate(-1 -1)\\"><rect width=\\"2\\" height=\\"24\\" x=\\"9\\" y=\\"-2\\" rx=\\"1\\" transform=\\"rotate(45 10 10)\\"/><rect width=\\"2\\" height=\\"24\\" x=\\"9\\" y=\\"-2\\" rx=\\"1\\" transform=\\"rotate(-45 10 10)\\"/></g></svg>
\t\t</div>
\t\t<div class=\\"label-tooltip-content\\">
\t\t\t<div class=\\"label-tooltip-content__subtitle spaced-content\\">
\t\t\t\t<div>Pleasant</div>
\t\t\t\t<div class=\\"label-tooltip-content__reference\\">63&#xB0; to 81&#xB0;</div>
\t\t\t</div>
\t\t\t<div class=\\"label-tooltip-content__content\\">Most consider this temperature range ideal.</div>
\t\t</div>
\t\t<a class=\\"label-tooltip-cta\\" href=\\"/en/realfeel-guide\\">LEARN MORE <svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"12\\" height=\\"12\\" viewBox=\\"0 0 12 12\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg></a>
\t</div>
</div>

\t\t\t\t</div>
\t\t\t\t<div class=\\"realfeel-shade-details\\">
\t\t\t\t\t<div>
\t\t\t\t\t\tRealFeel Shade™
\t\t\t\t\t\t59&#xB0;
\t\t\t\t\t\t
<div class=\\"label-tooltip\\" data-js=\\"prevent-accordion-toggle\\">
\t<div class=\\"label clickable \\">Cool</div>
\t<div class=\\"label-tooltip-overlay \\">
\t\t<div class=\\"label-tooltip-header spaced-content\\">
\t\t\t<span>RealFeel Guide</span>
\t\t\t<svg class=\\"close-icon\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 18 18\\"><g fill-rule=\\"evenodd\\" transform=\\"translate(-1 -1)\\"><rect width=\\"2\\" height=\\"24\\" x=\\"9\\" y=\\"-2\\" rx=\\"1\\" transform=\\"rotate(45 10 10)\\"/><rect width=\\"2\\" height=\\"24\\" x=\\"9\\" y=\\"-2\\" rx=\\"1\\" transform=\\"rotate(-45 10 10)\\"/></g></svg>
\t\t</div>
\t\t<div class=\\"label-tooltip-content\\">
\t\t\t<div class=\\"label-tooltip-content__subtitle spaced-content\\">
\t\t\t\t<div>Cool</div>
\t\t\t\t<div class=\\"label-tooltip-content__reference\\">53&#xB0; to 62&#xB0;</div>
\t\t\t</div>
\t\t\t<div class=\\"label-tooltip-content__content\\">Light jacket or sweater may be appropriate.</div>
\t\t</div>
\t\t<a class=\\"label-tooltip-cta\\" href=\\"/en/realfeel-guide\\">LEARN MORE <svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"12\\" height=\\"12\\" viewBox=\\"0 0 12 12\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg></a>
\t</div>
</div>

\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</div>

\t<div class=\\"half-day-card-content\\">
\t\t<div class=\\"phrase\\">Mostly sunny</div>

\t\t

\t\t<div class=\\"panels\\">
\t\t\t<div class=\\"left\\">
\t\t\t\t\t<p class=\\"panel-item\\">Max UV Index<span class=\\"value\\">11 Extreme</span></p>
\t\t\t\t\t<p class=\\"panel-item\\">Wind<span class=\\"value\\">WNW 7 mph</span></p>
\t\t\t\t\t<p class=\\"panel-item\\">Wind Gusts<span class=\\"value\\">18 mph</span></p>
\t\t\t\t\t<p class=\\"panel-item\\">Probability of Precipitation<span class=\\"value\\">0%</span></p>
\t\t\t</div>

\t\t\t<div class=\\"right\\">
\t\t\t\t\t<p class=\\"panel-item\\">Probability of Thunderstorms<span class=\\"value\\">0%</span></p>
\t\t\t\t\t<p class=\\"panel-item\\">Precipitation<span class=\\"value\\">0.00 in</span></p>
\t\t\t\t\t<p class=\\"panel-item\\">Cloud Cover<span class=\\"value\\">11%</span></p>
\t\t\t</div>
\t\t</div>
\t</div>

\t<div class=\\"quarter-day-ctas\\">
\t\t<h3>
\t\t\t<a class=\\"quarter-day-cta spaced-content\\" href=\\"/en/us/marina/93933/morning-weather-forecast/337145?day=1\\">
\t\t\t\tMorning
\t\t\t\t<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t</a>
\t\t</h3>

\t\t<h3>
\t\t\t<a class=\\"quarter-day-cta spaced-content\\" href=\\"/en/us/marina/93933/afternoon-weather-forecast/337145?day=1\\">
\t\t\t\tAfternoon
\t\t\t\t<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t</a>
\t\t</h3>
\t</div>

</div>


\t
<div class=\\"half-day-card  content-module  \\">
\t<div class=\\"half-day-card-header\\">
\t\t<div class=\\"half-day-card-header__title\\">
\t\t\t<h2 class=\\"title\\">Night</h2>
\t\t\t<span class=\\"short-date\\">
\t\t\t\t7/23
\t\t\t</span>
\t\t</div>
\t\t<div class=\\"half-day-card-header__content\\">
\t\t\t<div class=\\"weather\\">
\t\t\t\t<svg class=\\"icon\\" data-src=\\"/images/weathericons/36.svg\\" viewBox=\\"0 0 288 288\\" width=\\"128\\" height=\\"128\\"><g stroke-width=\\"10.764\\" fill=\\"none\\" fill-rule=\\"evenodd\\"><path d=\\"M189.565 73.268h4.952a26.91 26.91 0 0 1 48.009-16.147h9.095c11.89 0 21.529 9.64 21.529 21.529 0 11.89-9.639 21.529-21.529 21.529h-62.056c-7.43 0-13.455-6.025-13.455-13.456 0-7.431 6.024-13.455 13.455-13.455Z\\" stroke=\\"#BABABA\\"/><path d=\\"M123.85 261.643c57.675 22.82 123.414 1.058 156.082-51.669-50.074 11.483-102.036-9.155-130.585-51.865-28.549-42.71-27.75-98.614 2.005-140.493A127.072 127.072 0 0 0 50.114 185.379\\" stroke=\\"#686763\\" stroke-linejoin=\\"bevel\\"/><path d=\\"M39.134 191.675h4.737a43.057 43.057 0 0 1 76.534 25.834h6.889c11.778.582 21.03 10.301 21.03 22.094 0 11.793-9.252 21.512-21.03 22.094h-88.16c-18.568-1.03-33.096-16.388-33.096-34.984 0-18.597 14.528-33.954 33.096-34.984v-.054Z\\" stroke=\\"#BABABA\\"/></g></svg>
\t\t\t\t<div class=\\"temperature\\">
\t\t\t\t\t57&#xB0;<span class=\\"hi-lo-label\\">Lo</span>
\t\t\t\t</div>
\t\t\t</div>

\t\t\t<div class=\\"real-feel\\">
\t\t\t\t<div>
\t\t\t\t\tRealFeel&#xAE;
\t\t\t\t\t57&#xB0;
\t\t\t\t\t
<div class=\\"label-tooltip\\" data-js=\\"prevent-accordion-toggle\\">
\t<div class=\\"label clickable \\">Cool</div>
\t<div class=\\"label-tooltip-overlay \\">
\t\t<div class=\\"label-tooltip-header spaced-content\\">
\t\t\t<span>RealFeel Guide</span>
\t\t\t<svg class=\\"close-icon\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 18 18\\"><g fill-rule=\\"evenodd\\" transform=\\"translate(-1 -1)\\"><rect width=\\"2\\" height=\\"24\\" x=\\"9\\" y=\\"-2\\" rx=\\"1\\" transform=\\"rotate(45 10 10)\\"/><rect width=\\"2\\" height=\\"24\\" x=\\"9\\" y=\\"-2\\" rx=\\"1\\" transform=\\"rotate(-45 10 10)\\"/></g></svg>
\t\t</div>
\t\t<div class=\\"label-tooltip-content\\">
\t\t\t<div class=\\"label-tooltip-content__subtitle spaced-content\\">
\t\t\t\t<div>Cool</div>
\t\t\t\t<div class=\\"label-tooltip-content__reference\\">53&#xB0; to 62&#xB0;</div>
\t\t\t</div>
\t\t\t<div class=\\"label-tooltip-content__content\\">Light jacket or sweater may be appropriate.</div>
\t\t</div>
\t\t<a class=\\"label-tooltip-cta\\" href=\\"/en/realfeel-guide\\">LEARN MORE <svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"12\\" height=\\"12\\" viewBox=\\"0 0 12 12\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg></a>
\t</div>
</div>

\t\t\t\t</div>
\t\t\t\t
\t\t\t</div>
\t\t</div>
\t</div>

\t<div class=\\"half-day-card-content\\">
\t\t<div class=\\"phrase\\">Partly cloudy this evening; areas of low clouds late</div>

\t\t

\t\t<div class=\\"panels\\">
\t\t\t<div class=\\"left\\">
\t\t\t\t\t<p class=\\"panel-item\\">Wind<span class=\\"value\\">NW 5 mph</span></p>
\t\t\t\t\t<p class=\\"panel-item\\">Wind Gusts<span class=\\"value\\">8 mph</span></p>
\t\t\t\t\t<p class=\\"panel-item\\">Probability of Precipitation<span class=\\"value\\">1%</span></p>
\t\t\t</div>

\t\t\t<div class=\\"right\\">
\t\t\t\t\t<p class=\\"panel-item\\">Probability of Thunderstorms<span class=\\"value\\">0%</span></p>
\t\t\t\t\t<p class=\\"panel-item\\">Precipitation<span class=\\"value\\">0.00 in</span></p>
\t\t\t\t\t<p class=\\"panel-item\\">Cloud Cover<span class=\\"value\\">60%</span></p>
\t\t\t</div>
\t\t</div>
\t</div>

\t<div class=\\"quarter-day-ctas\\">
\t\t<h3>
\t\t\t<a class=\\"quarter-day-cta spaced-content\\" href=\\"/en/us/marina/93933/evening-weather-forecast/337145?day=1\\">
\t\t\t\tEvening
\t\t\t\t<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t</a>
\t\t</h3>

\t\t<h3>
\t\t\t<a class=\\"quarter-day-cta spaced-content\\" href=\\"/en/us/marina/93933/overnight-weather-forecast/337145?day=1\\">
\t\t\t\tOvernight
\t\t\t\t<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t</a>
\t\t</h3>
\t</div>

</div>


\t
\t<script>
\t\twindow.collapseConnatix = () => {
\t\t\tconst connatixEl = document.getElementById('connatix')
\t\t\tif(connatixEl) {
\t\t\t\tconnatixEl.style.display = \\"none\\";
\t\t\t}
\t\t}
\t</script>
\t<div id=\\"connatix\\" class=\\"content-module\\"></div>






\t<div class=\\"sunrise-sunset content-module \\">
\t<h2 class=\\"sunrise-sunset__title\\">
\t\tSun &amp; Moon
\t</h2>
\t<div class=\\"sunrise-sunset__body\\">
\t\t\t<div class=\\"sunrise-sunset__item\\">
\t\t\t\t<img class=\\"sunrise-sunset__icon sun-icon\\" width=\\"40\\" height=\\"40\\" aria-hidden=\\"true\\" src=\\"/images/whiteweathericons/1.svg\\" />
\t\t\t\t<span class=\\"sunrise-sunset__phrase\\">14 hrs 13 mins</span>
\t\t\t\t<div class=\\"sunrise-sunset__times\\">
\t\t\t\t\t<div class=\\"sunrise-sunset__times-item\\">
\t\t\t\t\t\t<span class=\\"sunrise-sunset__times-label\\">Rise</span>
\t\t\t\t\t\t<span class=\\"sunrise-sunset__times-value\\">6:07 AM</span>
\t\t\t\t\t</div>
\t\t\t\t\t<div class=\\"sunrise-sunset__times-item\\">
\t\t\t\t\t\t<span class=\\"sunrise-sunset__times-label\\">Set</span>
\t\t\t\t\t\t<span class=\\"sunrise-sunset__times-value\\">8:20 PM</span>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class=\\"sunrise-sunset__item\\">
\t\t\t\t<img class=\\"sunrise-sunset__icon\\" width=\\"40\\" height=\\"40\\" aria-hidden=\\"true\\" src=\\"/images/moon-phases/light/WaningGibbous.svg\\" />
\t\t\t\t<span class=\\"sunrise-sunset__phrase\\">Waning Gibbous</span>
\t\t\t\t<div class=\\"sunrise-sunset__times\\">
\t\t\t\t\t<div class=\\"sunrise-sunset__times-item\\">
\t\t\t\t\t\t<span class=\\"sunrise-sunset__times-label\\">Rise</span>
\t\t\t\t\t\t<span class=\\"sunrise-sunset__times-value\\">10:17 PM</span>
\t\t\t\t\t</div>
\t\t\t\t\t<div class=\\"sunrise-sunset__times-item\\">
\t\t\t\t\t\t<span class=\\"sunrise-sunset__times-label\\">Set</span>
\t\t\t\t\t\t<span class=\\"sunrise-sunset__times-value\\">9:48 AM</span>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t</div>
</div>


\t<div class=\\"temp-history content-module \\">
\t<div class=\\"history\\">
\t\t<div class=\\"title-row\\">
\t\t\t<h2>Temperature History</h2> <span class=\\"header-date\\">7/23</span>
\t\t</div>
\t\t<div class=\\"label-row\\">
\t\t\t<div class=\\"label\\"></div>
\t\t\t<div class=\\"temp-label\\">High</div>
\t\t\t<div class=\\"temp-label\\">Low</div>
\t\t</div>
\t\t<div class=\\"row first\\">
\t\t\t<div class=\\"label\\">Forecast</div>
\t\t\t<div class=\\"temperature\\">60&#xB0;</div>
\t\t\t<div class=\\"temperature\\">57&#xB0;</div>
\t\t</div>
\t\t<div class=\\"row\\">
\t\t\t<div class=\\"label\\">Average</div>
\t\t\t<div class=\\"temperature\\">66&#xB0;</div>
\t\t\t<div class=\\"temperature\\">52&#xB0;</div>
\t\t</div>
\t\t<div class=\\"row\\">
\t\t\t<div class=\\"label\\">Last Year</div>
\t\t\t<div class=\\"temperature\\">64&#xB0;</div>
\t\t\t<div class=\\"temperature\\">53&#xB0;</div>
\t\t</div>
\t</div>
</div>


\t
<div class=\\"more-cta-links \\">
\t<h2 class=\\"more-cta-title\\">
\t\t<p>Further Ahead</p>
\t</h2>
\t\t\t<a href=\\"/en/us/marina/93933/hourly-weather-forecast/337145\\" class=\\"cta-link\\" data-page-id=\\"\\" data-ga-page-id=\\"\\">
\t\t\t\t<h3 class=\\"cta-text\\">Hourly</h3>
\t\t\t\t<svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t</a>
\t\t\t<a href=\\"/en/us/marina/93933/daily-weather-forecast/337145\\" class=\\"cta-link\\" data-page-id=\\"\\" data-ga-page-id=\\"\\">
\t\t\t\t<h3 class=\\"cta-text\\">Daily</h3>
\t\t\t\t<svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t</a>
\t\t\t<a href=\\"/en/us/marina/93933/july-weather/337145\\" class=\\"cta-link\\" data-page-id=\\"\\" data-ga-page-id=\\"\\">
\t\t\t\t<h3 class=\\"cta-text\\">Monthly</h3>
\t\t\t\t<svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t</a>
</div>


\t\t\t</div>
\t\t\t
\t\t\t\t
<div class=\\"more-cta-links \\">
\t<h2 class=\\"more-cta-title\\">
\t\t<p>Around the Globe</p>
\t</h2>
\t\t\t<a href=\\"/en/hurricane\\" class=\\"cta-link\\" data-page-id=\\"hurricane\\" data-ga-page-id=\\"hurricane_tracker\\">
\t\t\t\t<h3 class=\\"cta-text\\">Hurricane Tracker</h3>
\t\t\t\t<svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t</a>
\t\t\t<a href=\\"/en/us/severe-weather\\" class=\\"cta-link\\" data-page-id=\\"severe-weather\\" data-ga-page-id=\\"severe_weather\\">
\t\t\t\t<h3 class=\\"cta-text\\">Severe Weather</h3>
\t\t\t\t<svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t</a>
\t\t\t<a href=\\"/en/us/california/weather-radar\\" class=\\"cta-link\\" data-page-id=\\"map-radar\\" data-ga-page-id=\\"radar_and_maps\\">
\t\t\t\t<h3 class=\\"cta-text\\">Radar &amp; Maps</h3>
\t\t\t\t<svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t</a>
\t\t\t<a href=\\"/en/weather-news\\" class=\\"cta-link\\" data-page-id=\\"\\" data-ga-page-id=\\"\\">
\t\t\t\t<h3 class=\\"cta-text\\">News</h3>
\t\t\t\t<svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t</a>
\t\t\t<a href=\\"/en/videos\\" class=\\"cta-link\\" data-page-id=\\"video-wall\\" data-ga-page-id=\\"video\\">
\t\t\t\t<h3 class=\\"cta-text\\">Video</h3>
\t\t\t\t<svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t</a>
\t\t\t<a href=\\"/en/us/winter-weather\\" class=\\"cta-link\\" data-page-id=\\"winter-weather\\" data-ga-page-id=\\"winter_center\\">
\t\t\t\t<h3 class=\\"cta-text\\">Winter Center</h3>
\t\t\t\t<svg class=\\"icon-arrow\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"18\\" height=\\"18\\" viewBox=\\"0 0 18 18\\"><defs><path id=\\"a\\" d=\\"m8.495.505 5 5v.99l-5 5-.99-.99 3.805-3.806L0 6.7V5.3l11.31-.001-3.805-3.804.99-.99z\\"/></defs><use fill=\\"#000\\" fill-rule=\\"nonzero\\" xlink:href=\\"#a\\" transform=\\"translate(2 3)\\"/></svg>
\t\t\t</a>
</div>

\t\t\t
\t\t\t
\t\t</div>
\t\t
\t\t\t<div class=\\"page-column-2\\">
\t\t\t\t
\t
<div class=\\"right-rail left-align-children\\">
\t<div class=\\"glacier-ad unrendered top_right config-top_right content-module\\" data-ad-type=\\"top_right\\" data-viewport=\\"tablet desktop\\" id=\\"top_right\\"></div>

\t
\t\t<div class=\\"zone-rightRail1 content-module \\">
\t\t\t<div class=\\"thumbnail-right-rail\\">
\t<p class=\\"title\\">Top Stories</p>
\t\t<a class=\\"right-rail-article right-rail-ga  \\"
\t\t\thref=\\"https://www.accuweather.com/en/weather-forecasts/showers-storms-to-continue-in-southeast-but-will-hammer-2-main-areas/1671571\\"
\t\t\tdata-ga-action=\\"Right Rail Click Editorial\\"
\t\t\tdata-ga-label=\\"Showers, storms to continue in Southeast, but will hammer 2 main areas\\"
\t\t\tdata-ga-section=\\"Top Stories\\"
\t\t\tdata-ga-display-type=\\"RightRailThumbnail\\"
\t\t>
\t\t\t<div class=\\"right-rail-article__meta\\">
\t\t\t\t
\t\t\t\t<p class=\\"right-rail-article__category\\">Weather Forecasts</p>
\t\t\t\t<p class=\\"right-rail-article__title\\">Showers, storms to continue in Southeast, but will hammer 2 main areas</p>
\t\t\t\t
\t\t\t\t<p class=\\"right-rail-article__time\\">6 hours ago</p>
\t\t\t</div>
\t\t\t\t<img alt=\\"\\" class=\\"js-content-image right-rail-article__thumb\\" data-src=\\"https://cms.accuweather.com/wp-content/uploads/2024/07/RainfallTuesThruSat23Jul.jpg?w=64&amp;h=64&amp;crop=1\\"  />

\t\t</a>
\t\t<a class=\\"right-rail-article right-rail-ga  \\"
\t\t\thref=\\"https://www.accuweather.com/en/weather-news/depressed-black-bear-sitting-next-to-florida-road-probably-overheated-officials-say/1671617\\"
\t\t\tdata-ga-action=\\"Right Rail Click Editorial\\"
\t\t\tdata-ga-label=\\"&#x27;Depressed&#x27; black bear sitting next to Florida road likley overheated\\"
\t\t\tdata-ga-section=\\"Top Stories\\"
\t\t\tdata-ga-display-type=\\"RightRailThumbnail\\"
\t\t>
\t\t\t<div class=\\"right-rail-article__meta\\">
\t\t\t\t
\t\t\t\t<p class=\\"right-rail-article__category\\">Weather News</p>
\t\t\t\t<p class=\\"right-rail-article__title\\">&#x27;Depressed&#x27; black bear sitting next to Florida road likley overheated</p>
\t\t\t\t
\t\t\t\t<p class=\\"right-rail-article__time\\">9 hours ago</p>
\t\t\t</div>
\t\t\t\t<img alt=\\"\\" class=\\"js-content-image right-rail-article__thumb\\" data-src=\\"https://cms.accuweather.com/wp-content/uploads/2024/07/Screenshot-2024-07-23-at-9.41.58-AM.png?w=64&amp;h=64&amp;crop=1\\"  />

\t\t</a>
\t\t<a class=\\"right-rail-article right-rail-ga  \\"
\t\t\thref=\\"https://www.accuweather.com/en/severe-weather/downpours-locally-severe-storms-return-to-midwest-and-northeast/1671252\\"
\t\t\tdata-ga-action=\\"Right Rail Click Editorial\\"
\t\t\tdata-ga-label=\\"Downpours, locally severe storms to return to Midwest and Northeast\\"
\t\t\tdata-ga-section=\\"Top Stories\\"
\t\t\tdata-ga-display-type=\\"RightRailThumbnail\\"
\t\t>
\t\t\t<div class=\\"right-rail-article__meta\\">
\t\t\t\t
\t\t\t\t<p class=\\"right-rail-article__category\\">Severe Weather</p>
\t\t\t\t<p class=\\"right-rail-article__title\\">Downpours, locally severe storms to return to Midwest and Northeast</p>
\t\t\t\t
\t\t\t\t<p class=\\"right-rail-article__time\\">3 hours ago</p>
\t\t\t</div>
\t\t\t\t<img alt=\\"\\" class=\\"js-content-image right-rail-article__thumb\\" data-src=\\"https://cms.accuweather.com/wp-content/uploads/2024/07/WedNESnap23Jul_2360f1.jpg?w=64&amp;h=64&amp;crop=1\\"  />

\t\t</a>
\t\t<a class=\\"right-rail-article right-rail-ga  \\"
\t\t\thref=\\"https://www.accuweather.com/en/weather-news/wildfire-smoke-descends-across-central-us-causes-unhealthy-air-quality/1671653\\"
\t\t\tdata-ga-action=\\"Right Rail Click Editorial\\"
\t\t\tdata-ga-label=\\"Wildfire smoke descends over central US, causes unhealthy air quality\\"
\t\t\tdata-ga-section=\\"Top Stories\\"
\t\t\tdata-ga-display-type=\\"RightRailThumbnail\\"
\t\t>
\t\t\t<div class=\\"right-rail-article__meta\\">
\t\t\t\t
\t\t\t\t<p class=\\"right-rail-article__category\\">Weather News</p>
\t\t\t\t<p class=\\"right-rail-article__title\\">Wildfire smoke descends over central US, causes unhealthy air quality</p>
\t\t\t\t
\t\t\t\t<p class=\\"right-rail-article__time\\">5 hours ago</p>
\t\t\t</div>
\t\t\t\t<img alt=\\"\\" class=\\"js-content-image right-rail-article__thumb\\" data-src=\\"https://cms.accuweather.com/wp-content/uploads/2024/07/Air-quality-Tuesday-morning.png?w=64&amp;h=64&amp;crop=1\\"  />

\t\t</a>
\t\t<a class=\\"right-rail-article right-rail-ga  \\"
\t\t\thref=\\"https://www.accuweather.com/en/weather-forecasts/monsoon-momentum-more-of-southwest-us-braces-for-thunderstorms/1671780\\"
\t\t\tdata-ga-action=\\"Right Rail Click Editorial\\"
\t\t\tdata-ga-label=\\"Monsoon momentum: More of Southwest US braces for thunderstorms\\"
\t\t\tdata-ga-section=\\"Top Stories\\"
\t\t\tdata-ga-display-type=\\"RightRailThumbnail\\"
\t\t>
\t\t\t<div class=\\"right-rail-article__meta\\">
\t\t\t\t
\t\t\t\t<p class=\\"right-rail-article__category\\">Weather Forecasts</p>
\t\t\t\t<p class=\\"right-rail-article__title\\">Monsoon momentum: More of Southwest US braces for thunderstorms</p>
\t\t\t\t
\t\t\t\t<p class=\\"right-rail-article__time\\">3 hours ago</p>
\t\t\t</div>
\t\t\t\t<img alt=\\"\\" class=\\"js-content-image right-rail-article__thumb\\" data-src=\\"https://cms.accuweather.com/wp-content/uploads/2024/07/SWPatternShift23Jul.jpg?w=64&amp;h=64&amp;crop=1\\"  />

\t\t</a>
\t<a class=\\"cta\\" href=\\"https://www.accuweather.com/en/weather-news\\">More Stories</a>
</div>



\t</div>

\t

\t<div class=\\"glacier-ad unrendered bottom_right config-bottom_right content-module\\" data-ad-type=\\"bottom_right\\" data-viewport=\\"tablet desktop\\" id=\\"bottom_right\\"></div>

\t\t<div class=\\"zone-rightRail2 content-module \\">
\t\t\t<div class=\\"thumbnail-right-rail\\">
\t<p class=\\"title\\">Featured Stories</p>
\t\t<a class=\\"right-rail-article right-rail-ga  \\"
\t\t\thref=\\"https://www.accuweather.com/en/leisure-recreation/utah-woman-dies-after-calling-for-help-while-hiking-amid-intense-heat/1671794\\"
\t\t\tdata-ga-action=\\"Right Rail Click Editorial\\"
\t\t\tdata-ga-label=\\"Utah woman dies after calling for help while hiking amid intense heat\\"
\t\t\tdata-ga-section=\\"Featured Stories\\"
\t\t\tdata-ga-display-type=\\"RightRailThumbnail\\"
\t\t>
\t\t\t<div class=\\"right-rail-article__meta\\">
\t\t\t\t
\t\t\t\t<p class=\\"right-rail-article__category\\">Recreation</p>
\t\t\t\t<p class=\\"right-rail-article__title\\">Utah woman dies after calling for help while hiking amid intense heat</p>
\t\t\t\t
\t\t\t\t<p class=\\"right-rail-article__time\\">4 hours ago</p>
\t\t\t</div>
\t\t\t\t<img alt=\\"\\" class=\\"js-content-image right-rail-article__thumb\\" data-src=\\"https://cms.accuweather.com/wp-content/uploads/2024/07/GettyImages-1135380504.jpg?w=64&amp;h=64&amp;crop=1\\"  />

\t\t</a>
\t\t<a class=\\"right-rail-article right-rail-ga  \\"
\t\t\thref=\\"https://www.accuweather.com/en/travel/delta-is-still-melting-down-it-could-last-all-week/1671589\\"
\t\t\tdata-ga-action=\\"Right Rail Click Editorial\\"
\t\t\tdata-ga-label=\\"Delta is still melting down. It could last all week\\"
\t\t\tdata-ga-section=\\"Featured Stories\\"
\t\t\tdata-ga-display-type=\\"RightRailThumbnail\\"
\t\t>
\t\t\t<div class=\\"right-rail-article__meta\\">
\t\t\t\t
\t\t\t\t<p class=\\"right-rail-article__category\\">Travel</p>
\t\t\t\t<p class=\\"right-rail-article__title\\">Delta is still melting down. It could last all week</p>
\t\t\t\t
\t\t\t\t<p class=\\"right-rail-article__time\\">7 hours ago</p>
\t\t\t</div>
\t\t\t\t<img alt=\\"\\" class=\\"js-content-image right-rail-article__thumb\\" data-src=\\"https://cms.accuweather.com/wp-content/uploads/2024/07/cnn-L19jb21wb25lbnRzL2ltYWdlL2luc3RhbmNlcy9jbHl5OWh6enMwMDBnM2I2a2h1em0xMGh2-L19jb21wb25lbnRzL2FydGljbGUvaW5zdGFuY2VzL2NseXk5NXZiNTAwMG5ydG5wNWhjaTZ5cnI.jpg?w=64&amp;h=64&amp;crop=1\\"  />

\t\t</a>
\t\t<a class=\\"right-rail-article right-rail-ga  \\"
\t\t\thref=\\"https://www.accuweather.com/en/weather-blogs/scientists-discover-dark-oxygen-being-produced-more-than-13000-feet-below-the-ocean-surface/1671580\\"
\t\t\tdata-ga-action=\\"Right Rail Click Editorial\\"
\t\t\tdata-ga-label=\\"&#x2018;Dark&#x2019; oxygen being produced more than 13,000 feet below ocean surface\\"
\t\t\tdata-ga-section=\\"Featured Stories\\"
\t\t\tdata-ga-display-type=\\"RightRailThumbnail\\"
\t\t>
\t\t\t<div class=\\"right-rail-article__meta\\">
\t\t\t\t
\t\t\t\t<p class=\\"right-rail-article__category\\">Weather Blogs</p>
\t\t\t\t<p class=\\"right-rail-article__title\\">&#x2018;Dark&#x2019; oxygen being produced more than 13,000 feet below ocean surface</p>
\t\t\t\t
\t\t\t\t<p class=\\"right-rail-article__time\\">9 hours ago</p>
\t\t\t</div>
\t\t\t\t<img alt=\\"\\" class=\\"js-content-image right-rail-article__thumb\\" data-src=\\"https://cms.accuweather.com/wp-content/uploads/2024/07/cnn-L19jb21wb25lbnRzL2ltYWdlL2luc3RhbmNlcy9jbHl2eWRqMWkwMDBhMzU2a254eGlyc3Fo-L19jb21wb25lbnRzL2FydGljbGUvaW5zdGFuY2VzL2NseXZ5M3dyODAwMG5hMXBlaGNrdDRxMXA.jpg?w=64&amp;h=64&amp;crop=1\\"  />

\t\t</a>
\t\t<a class=\\"right-rail-article right-rail-ga  \\"
\t\t\thref=\\"https://www.accuweather.com/en/weather-news/ballet-inspired-double-skyscraper-design-tricks-the-eye/1671610\\"
\t\t\tdata-ga-action=\\"Right Rail Click Editorial\\"
\t\t\tdata-ga-label=\\"Ballet-inspired double skyscraper design tricks the eye\\"
\t\t\tdata-ga-section=\\"Featured Stories\\"
\t\t\tdata-ga-display-type=\\"RightRailThumbnail\\"
\t\t>
\t\t\t<div class=\\"right-rail-article__meta\\">
\t\t\t\t
\t\t\t\t<p class=\\"right-rail-article__category\\">Weather News</p>
\t\t\t\t<p class=\\"right-rail-article__title\\">Ballet-inspired double skyscraper design tricks the eye</p>
\t\t\t\t
\t\t\t\t<p class=\\"right-rail-article__time\\">9 hours ago</p>
\t\t\t</div>
\t\t\t\t<img alt=\\"\\" class=\\"js-content-image right-rail-article__thumb\\" data-src=\\"https://cms.accuweather.com/wp-content/uploads/2024/07/cnn-L19jb21wb25lbnRzL2ltYWdlL2luc3RhbmNlcy9jbHlycG9jajEwMDAwM2I2bGcybnd1YTh3-L19jb21wb25lbnRzL2FydGljbGUvaW5zdGFuY2VzL2NseXJwZnJyZTAwMHQ2NG5wMHNhZjF3aTk.jpg?w=64&amp;h=64&amp;crop=1\\"  />

\t\t</a>
\t\t<a class=\\"right-rail-article right-rail-ga  \\"
\t\t\thref=\\"https://www.accuweather.com/en/health-wellness/cdc-confirms-sixth-colorado-bird-flu-case/1671324\\"
\t\t\tdata-ga-action=\\"Right Rail Click Editorial\\"
\t\t\tdata-ga-label=\\"CDC confirms sixth Colorado bird flu case\\"
\t\t\tdata-ga-section=\\"Featured Stories\\"
\t\t\tdata-ga-display-type=\\"RightRailThumbnail\\"
\t\t>
\t\t\t<div class=\\"right-rail-article__meta\\">
\t\t\t\t
\t\t\t\t<p class=\\"right-rail-article__category\\">Health</p>
\t\t\t\t<p class=\\"right-rail-article__title\\">CDC confirms sixth Colorado bird flu case</p>
\t\t\t\t
\t\t\t\t<p class=\\"right-rail-article__time\\">1 day ago</p>
\t\t\t</div>
\t\t\t\t<img alt=\\"\\" class=\\"js-content-image right-rail-article__thumb\\" data-src=\\"https://cms.accuweather.com/wp-content/uploads/2024/07/CDC-confirms-sixth-Colorado-bird-flu-case.jpg?w=64&amp;h=64&amp;crop=1\\"  />

\t\t</a>
\t
</div>



\t</div>

</div>


\t\t\t</div>
\t\t
\t</div>
\t
\t\t<div class=\\"glacier-ad unrendered bottom config-bottom content-module\\" data-ad-type=\\"bottom\\" data-viewport=\\"\\" id=\\"bottom\\"></div>

\t
\t
\t\t<div class=\\"breadcrumbs \\">
\t<div class=\\"crumbs\\">
\t\t\t<a href=\\"/en/world-weather\\" class=\\"breadcrumbs__link\\">World</a>
\t\t\t<svg class=\\"breadcrumbs__chevron chevron-icon right\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"10\\" height=\\"6\\" viewBox=\\"0 0 10 6\\"><path d=\\"M10 .969L9.037 0 5 4.063.963 0 0 .969 5 6z\\" /></svg>
\t\t\t<a href=\\"/en/north-america-weather\\" class=\\"breadcrumbs__link\\">North America</a>
\t\t\t<svg class=\\"breadcrumbs__chevron chevron-icon right\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"10\\" height=\\"6\\" viewBox=\\"0 0 10 6\\"><path d=\\"M10 .969L9.037 0 5 4.063.963 0 0 .969 5 6z\\" /></svg>
\t\t\t<a href=\\"/en/us/united-states-weather\\" class=\\"breadcrumbs__link\\">United States</a>
\t\t\t<svg class=\\"breadcrumbs__chevron chevron-icon right\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"10\\" height=\\"6\\" viewBox=\\"0 0 10 6\\"><path d=\\"M10 .969L9.037 0 5 4.063.963 0 0 .969 5 6z\\" /></svg>
\t\t\t<a href=\\"/en/us/ca/california-weather\\" class=\\"breadcrumbs__link\\">California</a>
\t\t\t<svg class=\\"breadcrumbs__chevron chevron-icon right\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"10\\" height=\\"6\\" viewBox=\\"0 0 10 6\\"><path d=\\"M10 .969L9.037 0 5 4.063.963 0 0 .969 5 6z\\" /></svg>
\t\t\t<a href=\\"/en/us/marina/93933/weather-forecast/337145\\" class=\\"breadcrumbs__link\\">Marina</a>
\t\t\t
\t</div>
</div>

\t
\t
\t\t
<div class=\\"neighbors-wrapper\\">
\t<div class=\\"neighbors-wrapper__content\\">
\t\t\t<h2 class=\\"neighbors-title\\">Weather Near Marina:</h2>
\t\t<div class=\\"neighbors-scroll\\">
\t\t\t<ul id=\\"neighbors\\" class=\\"neighbor-items\\">
\t\t\t\t\t<li class=\\"neighbor-item\\" itemprop=\\"address\\" itemscope=\\"true\\" itemtype=\\"https://schema.org/PostalAddress\\">
\t\t\t\t\t\t<a href=\\"/en/us/salinas/93901/weather-forecast/327135\\" class=\\"neighbor-link\\" data-from-string=\\"nearby_locations\\">
\t\t\t\t\t\t\t<span itemprop=\\"addressLocality\\">Salinas</span>,
\t\t\t\t\t\t\t<span itemprop=\\"addressRegion\\">CA</span>
\t\t\t\t\t\t</a>
\t\t\t\t\t</li>
\t\t\t\t\t<li class=\\"neighbor-item\\" itemprop=\\"address\\" itemscope=\\"true\\" itemtype=\\"https://schema.org/PostalAddress\\">
\t\t\t\t\t\t<a href=\\"/en/us/santa-cruz/95060/weather-forecast/327138\\" class=\\"neighbor-link\\" data-from-string=\\"nearby_locations\\">
\t\t\t\t\t\t\t<span itemprop=\\"addressLocality\\">Santa Cruz</span>,
\t\t\t\t\t\t\t<span itemprop=\\"addressRegion\\">CA</span>
\t\t\t\t\t\t</a>
\t\t\t\t\t</li>
\t\t\t\t\t<li class=\\"neighbor-item\\" itemprop=\\"address\\" itemscope=\\"true\\" itemtype=\\"https://schema.org/PostalAddress\\">
\t\t\t\t\t\t<a href=\\"/en/us/watsonville/95076/weather-forecast/337294\\" class=\\"neighbor-link\\" data-from-string=\\"nearby_locations\\">
\t\t\t\t\t\t\t<span itemprop=\\"addressLocality\\">Watsonville</span>,
\t\t\t\t\t\t\t<span itemprop=\\"addressRegion\\">CA</span>
\t\t\t\t\t\t</a>
\t\t\t\t\t</li>
\t\t\t</ul>
\t\t</div>
\t</div>
</div>

\t
\t<div class=\\"base-footer is-en  \\">
\t<span class=\\"\\">
\t\t\t<div class=\\"footer-content\\">
\t<div class=\\"footer-content-mobile\\">
\t\t<div class=\\"footer-content-accordion\\">
\t\t\t\t<div data-qa=\\"\\" class=\\"accordion-item accordion-item-simple footer-content-accordion-item\\" data-shared=\\"true\\" data-collapsed=\\"true\\">
\t<div class=\\"accordion-item-header-container \\">
\t\t<div class=\\"accordion-item-header accordion-item-simple-header\\">
\t\t<span class=\\"accordion-item-header-content\\">Company</span>
\t<svg class=\\"accordion-item-header-icon chevron-icon down\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"10\\" height=\\"6\\" viewBox=\\"0 0 10 6\\"><path d=\\"M10 .969L9.037 0 5 4.063.963 0 0 .969 5 6z\\" /></svg>
</div>

\t</div>
\t<div class=\\"accordion-item-content \\">
\t\t<div class=\\"footer-category-section footer-category-accordion\\">
\t\t\t<a data-gacategory=\\"Company\\" data-gatext=\\"Proven Superior Accuracy\\" data-pagetype=\\"corporate\\" class=\\"footer-category-section-link \\" href=\\"https://corporate.accuweather.com/\\" target=\\"_blank\\">
\t\t\t\tProven Superior Accuracy
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Company\\" data-gatext=\\"About AccuWeather\\" data-pagetype=\\"corporate\\" class=\\"footer-category-section-link \\" href=\\"https://corporate.accuweather.com/company/about-us/\\" target=\\"_blank\\">
\t\t\t\tAbout AccuWeather
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Company\\" data-gatext=\\"Digital Advertising\\" data-pagetype=\\"advertising\\" class=\\"footer-category-section-link \\" href=\\"https://advertising.accuweather.com/for-advertising/digital-advertising/\\" target=\\"_blank\\">
\t\t\t\tDigital Advertising
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Company\\" data-gatext=\\"Careers\\" data-pagetype=\\"corporate\\" class=\\"footer-category-section-link \\" href=\\"https://corporate.accuweather.com/company/careers/\\" target=\\"_blank\\">
\t\t\t\tCareers
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Company\\" data-gatext=\\"Press\\" data-pagetype=\\"corporate\\" class=\\"footer-category-section-link \\" href=\\"https://corporate.accuweather.com/newsroom/press-releases/\\" target=\\"_blank\\">
\t\t\t\tPress
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Company\\" data-gatext=\\"Contact Us\\" data-pagetype=\\"corporate\\" class=\\"footer-category-section-link \\" href=\\"/en/contact\\" target=\\"_blank\\">
\t\t\t\tContact Us
\t\t\t</a>
</div>

\t</div>
</div>


\t\t\t\t<div data-qa=\\"\\" class=\\"accordion-item accordion-item-simple footer-content-accordion-item\\" data-shared=\\"true\\" data-collapsed=\\"true\\">
\t<div class=\\"accordion-item-header-container \\">
\t\t<div class=\\"accordion-item-header accordion-item-simple-header\\">
\t\t<span class=\\"accordion-item-header-content\\">Products &amp; Services</span>
\t<svg class=\\"accordion-item-header-icon chevron-icon down\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"10\\" height=\\"6\\" viewBox=\\"0 0 10 6\\"><path d=\\"M10 .969L9.037 0 5 4.063.963 0 0 .969 5 6z\\" /></svg>
</div>

\t</div>
\t<div class=\\"accordion-item-content \\">
\t\t<div class=\\"footer-category-section footer-category-accordion\\">
\t\t\t<a data-gacategory=\\"Products &amp; Services\\" data-gatext=\\"For Business\\" data-pagetype=\\"business\\" class=\\"footer-category-section-link \\" href=\\"https://afb.accuweather.com/\\" target=\\"_blank\\">
\t\t\t\tFor Business
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Products &amp; Services\\" data-gatext=\\"For Partners\\" data-pagetype=\\"partners\\" class=\\"footer-category-section-link \\" href=\\"https://partners.accuweather.com/\\" target=\\"_blank\\">
\t\t\t\tFor Partners
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Products &amp; Services\\" data-gatext=\\"For Advertising\\" data-pagetype=\\"advertising\\" class=\\"footer-category-section-link \\" href=\\"https://advertising.accuweather.com/\\" target=\\"_blank\\">
\t\t\t\tFor Advertising
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Products &amp; Services\\" data-gatext=\\"AccuWeather APIs\\" data-pagetype=\\"developer\\" class=\\"footer-category-section-link \\" href=\\"https://developer.accuweather.com/\\" target=\\"_blank\\">
\t\t\t\tAccuWeather APIs
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Products &amp; Services\\" data-gatext=\\"AccuWeather Connect\\" data-pagetype=\\"connect\\" class=\\"footer-category-section-link \\" href=\\"https://afb.accuweather.com/accuweather-connect-and-content-syndication\\" target=\\"_blank\\">
\t\t\t\tAccuWeather Connect
\t\t\t</a>
\t\t\t
\t\t\t<span class=\\"footer-category-section-link  text\\">RealFeel&#xAE; and RealFeel Shade&#x2122;</span>
</div>

\t</div>
</div>


\t\t\t\t<div data-qa=\\"\\" class=\\"accordion-item accordion-item-simple footer-content-accordion-item\\" data-shared=\\"true\\" data-collapsed=\\"true\\">
\t<div class=\\"accordion-item-header-container \\">
\t\t<div class=\\"accordion-item-header accordion-item-simple-header\\">
\t\t<span class=\\"accordion-item-header-content\\">Apps &amp; Downloads</span>
\t<svg class=\\"accordion-item-header-icon chevron-icon down\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"10\\" height=\\"6\\" viewBox=\\"0 0 10 6\\"><path d=\\"M10 .969L9.037 0 5 4.063.963 0 0 .969 5 6z\\" /></svg>
</div>

\t</div>
\t<div class=\\"accordion-item-content \\">
\t\t<div class=\\"footer-category-section footer-category-accordion\\">
\t\t\t<a data-gacategory=\\"Apps &amp; Downloads\\" data-gatext=\\"iPhone App\\" data-pagetype=\\"apple\\" class=\\"footer-category-section-link \\" href=\\"https://go.onelink.me/app/ef253ee1\\" target=\\"_blank\\">
\t\t\t\tiPhone App
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Apps &amp; Downloads\\" data-gatext=\\"Android App\\" data-pagetype=\\"android\\" class=\\"footer-category-section-link \\" href=\\"https://go.onelink.me/app/85d14e58\\" target=\\"_blank\\">
\t\t\t\tAndroid App
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Apps &amp; Downloads\\" data-gatext=\\"See all Apps &amp; Downloads\\" data-pagetype=\\"downloads\\" class=\\"footer-category-section-link \\" href=\\"https://7482826.hs-sites.com/premium-plus\\" target=\\"_blank\\">
\t\t\t\tSee all Apps &amp; Downloads
\t\t\t</a>
</div>

\t</div>
</div>


\t\t\t\t<div data-qa=\\"\\" class=\\"accordion-item accordion-item-simple footer-content-accordion-item\\" data-shared=\\"true\\" data-collapsed=\\"true\\">
\t<div class=\\"accordion-item-header-container \\">
\t\t<div class=\\"accordion-item-header accordion-item-simple-header\\">
\t\t<span class=\\"accordion-item-header-content\\">Subscription Services</span>
\t<svg class=\\"accordion-item-header-icon chevron-icon down\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"10\\" height=\\"6\\" viewBox=\\"0 0 10 6\\"><path d=\\"M10 .969L9.037 0 5 4.063.963 0 0 .969 5 6z\\" /></svg>
</div>

\t</div>
\t<div class=\\"accordion-item-content \\">
\t\t<div class=\\"footer-category-section footer-category-accordion\\">
\t\t\t<a data-gacategory=\\"Subscription Services\\" data-gatext=\\"AccuWeather Premium\\" data-pagetype=\\"premium\\" class=\\"footer-category-section-link \\" href=\\"https://wwwl.accuweather.com/premium_login.php\\" target=\\"_blank\\">
\t\t\t\tAccuWeather Premium
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Subscription Services\\" data-gatext=\\"AccuWeather Professional\\" data-pagetype=\\"pro\\" class=\\"footer-category-section-link \\" href=\\"https://wwwl.accuweather.com/pro_login.php\\" target=\\"_blank\\">
\t\t\t\tAccuWeather Professional
\t\t\t</a>
</div>

\t</div>
</div>


\t\t\t\t<div data-qa=\\"\\" class=\\"accordion-item accordion-item-simple footer-content-accordion-item\\" data-shared=\\"true\\" data-collapsed=\\"true\\">
\t<div class=\\"accordion-item-header-container \\">
\t\t<div class=\\"accordion-item-header accordion-item-simple-header\\">
\t\t<span class=\\"accordion-item-header-content\\">More</span>
\t<svg class=\\"accordion-item-header-icon chevron-icon down\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"10\\" height=\\"6\\" viewBox=\\"0 0 10 6\\"><path d=\\"M10 .969L9.037 0 5 4.063.963 0 0 .969 5 6z\\" /></svg>
</div>

\t</div>
\t<div class=\\"accordion-item-content \\">
\t\t<div class=\\"footer-category-section footer-category-accordion\\">
\t\t\t<a data-gacategory=\\"More\\" data-gatext=\\"AccuWeather Ready\\" data-pagetype=\\"accuweather-ready\\" class=\\"footer-category-section-link \\" href=\\"/en/accuweather-ready\\">
\t\t\t\tAccuWeather Ready
\t\t\t</a>
\t\t\t<a data-gacategory=\\"More\\" data-gatext=\\"Business\\" data-pagetype=\\"content-landing\\" class=\\"footer-category-section-link \\" href=\\"/en/business\\">
\t\t\t\tBusiness
\t\t\t</a>
\t\t\t<a data-gacategory=\\"More\\" data-gatext=\\"Health\\" data-pagetype=\\"content-landing\\" class=\\"footer-category-section-link \\" href=\\"/en/health-wellness\\">
\t\t\t\tHealth
\t\t\t</a>
\t\t\t<a data-gacategory=\\"More\\" data-gatext=\\"Hurricane\\" data-pagetype=\\"hurricane\\" class=\\"footer-category-section-link \\" href=\\"/en/hurricane\\">
\t\t\t\tHurricane
\t\t\t</a>
\t\t\t<a data-gacategory=\\"More\\" data-gatext=\\"Leisure and Recreation\\" data-pagetype=\\"content-landing\\" class=\\"footer-category-section-link \\" href=\\"/en/leisure-recreation\\">
\t\t\t\tLeisure and Recreation
\t\t\t</a>
\t\t\t<a data-gacategory=\\"More\\" data-gatext=\\"Severe Weather\\" data-pagetype=\\"severe-weather\\" class=\\"footer-category-section-link \\" href=\\"/en/us/severe-weather\\">
\t\t\t\tSevere Weather
\t\t\t</a>
\t\t\t<a data-gacategory=\\"More\\" data-gatext=\\"Space and Astronomy\\" data-pagetype=\\"content-landing\\" class=\\"footer-category-section-link \\" href=\\"/en/space-news\\">
\t\t\t\tSpace and Astronomy
\t\t\t</a>
\t\t\t<a data-gacategory=\\"More\\" data-gatext=\\"Sports\\" data-pagetype=\\"content-landing\\" class=\\"footer-category-section-link \\" href=\\"/en/sports\\">
\t\t\t\tSports
\t\t\t</a>
\t\t\t<a data-gacategory=\\"More\\" data-gatext=\\"Travel\\" data-pagetype=\\"content-landing\\" class=\\"footer-category-section-link \\" href=\\"/en/travel\\">
\t\t\t\tTravel
\t\t\t</a>
\t\t\t<a data-gacategory=\\"More\\" data-gatext=\\"Weather News\\" data-pagetype=\\"news\\" class=\\"footer-category-section-link \\" href=\\"/en/weather-news\\">
\t\t\t\tWeather News
\t\t\t</a>
\t\t\t<a data-gacategory=\\"More\\" data-gatext=\\"Winter Center\\" data-pagetype=\\"winter-weather\\" class=\\"footer-category-section-link \\" href=\\"/en/us/winter-weather\\">
\t\t\t\tWinter Center
\t\t\t</a>
</div>

\t</div>
</div>


\t\t</div>
\t\t<div class=\\"footer-social \\">
\t<a
\t\tclass=\\"social-link\\"
\t\tdata-gatype=\\"outbound\\"
\t\tdata-gacategory=\\"Downloads\\"
\t\tdata-galink=\\"https://downloads.accuweather.com/\\"
\t\thref=\\"https://downloads.accuweather.com/\\"
\t\ttarget=\\"_blank\\"
\t\trel=\\"noopener noreferrer\\"
\t>
\t\t<svg data-src=\\"/images/socialicons/downloads.svg\\" class=\\"social-icon\\" alt=\\"Social Icon\\" width=\\"32\\" height=\\"32\\" viewBox=\\"0 0 36 36\\"><g fill=\\"none\\" fill-rule=\\"evenodd\\"><path d=\\"M18 0C8.053 0 0 8.053 0 18s8.053 18 18 18 18-8.053 18-18S27.947 0 18 0Z\\" fill=\\"#EE5723\\"/><path d=\\"M12.88 12.947a7.243 7.243 0 0 1 10.24 0c2.813 2.826 2.827 7.413 0 10.226-2.827 2.827-7.413 2.827-10.227 0-2.826-2.813-2.826-7.4-.013-10.226ZM18 9.907c-4.467 0-8.107 3.64-8.107 8.106 0 4.467 3.64 8.107 8.107 8.107 4.467 0 8.107-3.64 8.107-8.107 0-4.48-3.64-8.106-8.107-8.106Zm10.12 2.213-3.52-.76-.773-3.507L20.4 8.947l-2.427-2.654L15.56 8.96l-3.427-1.08-.76 3.52-3.506.773L8.973 15.6 6.32 18.027l2.667 2.413-1.08 3.427 3.52.76.773 3.506 3.427-1.093 2.426 2.653 2.414-2.666 3.426 1.08.76-3.52 3.507-.787-1.107-3.427 2.654-2.426-2.667-2.414 1.08-3.413Z\\" fill=\\"#FFF\\"/></g></svg>
\t</a>
\t<a
\t\tclass=\\"social-link\\"
\t\tdata-gatype=\\"social\\"
\t\tdata-gacategory=\\"Facebook\\"
\t\tdata-galink=\\"https://www.facebook.com/AccuWeather\\"
\t\thref=\\"https://www.facebook.com/AccuWeather\\"
\t\ttarget=\\"_blank\\"
\t\trel=\\"noopener noreferrer\\"
\t>
\t\t<svg data-src=\\"/images/socialicons/facebook.svg\\" class=\\"social-icon\\" alt=\\"Social Icon\\" width=\\"32\\" height=\\"32\\" viewBox=\\"0 0 36 36\\"><g fill-rule=\\"nonzero\\" fill=\\"none\\"><path d=\\"M20.8 5.069c-9.946 0-11.514 4.3-11.514 14.247 0 8.092-1.997 5.082 5.346 7.352C16.315 27.188 16.145 36 18 36c1.72 0 3.383-.24 4.957-.69 2.408-.688 4.466-4.135 6.173-10.342 1.644-2.179 2.466-4.696 2.466-7.55 0-9.947-.85-12.35-10.796-12.35Z\\" fill=\\"#FFF\\"/><path d=\\"M18 0C8.053 0 0 8.053 0 18c0 9.893 7.987 17.933 17.867 18V23.653h-4.16V18.84h4.16v-3.547c0-4.12 2.52-6.36 6.186-6.36 1.76 0 3.267.134 3.707.187v4.307h-2.547c-2 0-2.386.946-2.386 2.346v3.067H27.6l-.627 4.813h-4.146v11.694C30.427 33.227 36 26.267 36 18c0-9.947-8.053-18-18-18Z\\" fill=\\"#4167B2\\"/></g></svg>
\t</a>
\t<a
\t\tclass=\\"social-link\\"
\t\tdata-gatype=\\"social\\"
\t\tdata-gacategory=\\"Twitter\\"
\t\tdata-galink=\\"https://twitter.com/BreakingWeather\\"
\t\thref=\\"https://twitter.com/BreakingWeather\\"
\t\ttarget=\\"_blank\\"
\t\trel=\\"noopener noreferrer\\"
\t>
\t\t<svg data-src=\\"/images/socialicons/twitter.svg\\" class=\\"social-icon\\" alt=\\"Social Icon\\" width=\\"32\\" height=\\"32\\" viewBox=\\"0 0 36 36\\"><g fill-rule=\\"nonzero\\" fill=\\"none\\"><path d=\\"M18 0C8.053 0 0 8.053 0 18s8.053 18 18 18 18-8.053 18-18S27.947 0 18 0Z\\" fill=\\"#1DA1F3\\"/><path d=\\"M26.904 14.316c.012.183.012.376.012.57 0 5.774-4.294 12.448-12.14 12.448a11.96 11.96 0 0 1-6.538-1.96c.33.046.672.058 1.014.058a8.424 8.424 0 0 0 5.296-1.868c-1.868-.034-3.44-1.298-3.987-3.04.262.056.524.079.798.079.387 0 .763-.057 1.127-.16-1.947-.398-3.428-2.163-3.428-4.293v-.057c.581.33 1.23.524 1.936.547a4.417 4.417 0 0 1-1.902-3.645c0-.797.205-1.549.581-2.198 2.107 2.654 5.25 4.385 8.792 4.567a4.717 4.717 0 0 1-.114-.99c0-2.415 1.914-4.374 4.26-4.374 1.23 0 2.335.535 3.109 1.378a8.26 8.26 0 0 0 2.71-1.06 4.3 4.3 0 0 1-1.879 2.415A8.4 8.4 0 0 0 29 12.05c-.535.877-1.264 1.64-2.096 2.266Z\\" fill=\\"#FFF\\"/></g></svg>
\t</a>
</div>

\t</div>
\t<div class=\\"footer-content-tablet\\">
\t\t\t<div class=\\"footer-content-category\\">
\t\t\t\t<div class=\\"footer-content-category-wrapper\\">
\t\t\t\t\t<div class=\\"footer-content-category-header\\">Company</div>
\t\t\t\t\t<div class=\\"footer-category-section \\">
\t\t\t<a data-gacategory=\\"Company\\" data-gatext=\\"Proven Superior Accuracy\\" data-pagetype=\\"corporate\\" class=\\"footer-category-section-link \\" href=\\"https://corporate.accuweather.com/\\" target=\\"_blank\\">
\t\t\t\tProven Superior Accuracy
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Company\\" data-gatext=\\"About AccuWeather\\" data-pagetype=\\"corporate\\" class=\\"footer-category-section-link \\" href=\\"https://corporate.accuweather.com/company/about-us/\\" target=\\"_blank\\">
\t\t\t\tAbout AccuWeather
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Company\\" data-gatext=\\"Digital Advertising\\" data-pagetype=\\"advertising\\" class=\\"footer-category-section-link \\" href=\\"https://advertising.accuweather.com/for-advertising/digital-advertising/\\" target=\\"_blank\\">
\t\t\t\tDigital Advertising
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Company\\" data-gatext=\\"Careers\\" data-pagetype=\\"corporate\\" class=\\"footer-category-section-link \\" href=\\"https://corporate.accuweather.com/company/careers/\\" target=\\"_blank\\">
\t\t\t\tCareers
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Company\\" data-gatext=\\"Press\\" data-pagetype=\\"corporate\\" class=\\"footer-category-section-link \\" href=\\"https://corporate.accuweather.com/newsroom/press-releases/\\" target=\\"_blank\\">
\t\t\t\tPress
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Company\\" data-gatext=\\"Contact Us\\" data-pagetype=\\"corporate\\" class=\\"footer-category-section-link \\" href=\\"/en/contact\\" target=\\"_blank\\">
\t\t\t\tContact Us
\t\t\t</a>
</div>

\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class=\\"footer-content-category\\">
\t\t\t\t<div class=\\"footer-content-category-wrapper\\">
\t\t\t\t\t<div class=\\"footer-content-category-header\\">Products &amp; Services</div>
\t\t\t\t\t<div class=\\"footer-category-section \\">
\t\t\t<a data-gacategory=\\"Products &amp; Services\\" data-gatext=\\"For Business\\" data-pagetype=\\"business\\" class=\\"footer-category-section-link \\" href=\\"https://afb.accuweather.com/\\" target=\\"_blank\\">
\t\t\t\tFor Business
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Products &amp; Services\\" data-gatext=\\"For Partners\\" data-pagetype=\\"partners\\" class=\\"footer-category-section-link \\" href=\\"https://partners.accuweather.com/\\" target=\\"_blank\\">
\t\t\t\tFor Partners
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Products &amp; Services\\" data-gatext=\\"For Advertising\\" data-pagetype=\\"advertising\\" class=\\"footer-category-section-link \\" href=\\"https://advertising.accuweather.com/\\" target=\\"_blank\\">
\t\t\t\tFor Advertising
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Products &amp; Services\\" data-gatext=\\"AccuWeather APIs\\" data-pagetype=\\"developer\\" class=\\"footer-category-section-link \\" href=\\"https://developer.accuweather.com/\\" target=\\"_blank\\">
\t\t\t\tAccuWeather APIs
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Products &amp; Services\\" data-gatext=\\"AccuWeather Connect\\" data-pagetype=\\"connect\\" class=\\"footer-category-section-link \\" href=\\"https://afb.accuweather.com/accuweather-connect-and-content-syndication\\" target=\\"_blank\\">
\t\t\t\tAccuWeather Connect
\t\t\t</a>
\t\t\t
\t\t\t<span class=\\"footer-category-section-link  text\\">RealFeel&#xAE; and RealFeel Shade&#x2122;</span>
</div>

\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class=\\"footer-content-category\\">
\t\t\t\t<div class=\\"footer-content-category-wrapper\\">
\t\t\t\t\t<div class=\\"footer-content-category-header\\">Apps &amp; Downloads</div>
\t\t\t\t\t<div class=\\"footer-category-section \\">
\t\t\t<a data-gacategory=\\"Apps &amp; Downloads\\" data-gatext=\\"iPhone App\\" data-pagetype=\\"apple\\" class=\\"footer-category-section-link \\" href=\\"https://go.onelink.me/app/ef253ee1\\" target=\\"_blank\\">
\t\t\t\tiPhone App
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Apps &amp; Downloads\\" data-gatext=\\"Android App\\" data-pagetype=\\"android\\" class=\\"footer-category-section-link \\" href=\\"https://go.onelink.me/app/85d14e58\\" target=\\"_blank\\">
\t\t\t\tAndroid App
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Apps &amp; Downloads\\" data-gatext=\\"See all Apps &amp; Downloads\\" data-pagetype=\\"downloads\\" class=\\"footer-category-section-link \\" href=\\"https://7482826.hs-sites.com/premium-plus\\" target=\\"_blank\\">
\t\t\t\tSee all Apps &amp; Downloads
\t\t\t</a>
</div>

\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class=\\"footer-content-category\\">
\t\t\t\t<div class=\\"footer-content-category-wrapper\\">
\t\t\t\t\t<div class=\\"footer-content-category-header\\">Subscription Services</div>
\t\t\t\t\t\t<div class=\\"footer-category-section \\">
\t\t\t<a data-gacategory=\\"Subscription Services\\" data-gatext=\\"AccuWeather Premium\\" data-pagetype=\\"premium\\" class=\\"footer-category-section-link \\" href=\\"https://wwwl.accuweather.com/premium_login.php\\" target=\\"_blank\\">
\t\t\t\tAccuWeather Premium
\t\t\t</a>
\t\t\t<a data-gacategory=\\"Subscription Services\\" data-gatext=\\"AccuWeather Professional\\" data-pagetype=\\"pro\\" class=\\"footer-category-section-link \\" href=\\"https://wwwl.accuweather.com/pro_login.php\\" target=\\"_blank\\">
\t\t\t\tAccuWeather Professional
\t\t\t</a>
</div>

\t\t\t\t</div>
\t\t\t</div>
\t\t\t<div class=\\"footer-content-category\\">
\t\t\t\t<div class=\\"footer-content-category-wrapper\\">
\t\t\t\t\t<div class=\\"footer-content-category-header\\">More</div>
\t\t\t\t\t<div class=\\"footer-category-section \\">
\t\t\t<a data-gacategory=\\"More\\" data-gatext=\\"AccuWeather Ready\\" data-pagetype=\\"accuweather-ready\\" class=\\"footer-category-section-link \\" href=\\"/en/accuweather-ready\\">
\t\t\t\tAccuWeather Ready
\t\t\t</a>
\t\t\t<a data-gacategory=\\"More\\" data-gatext=\\"Business\\" data-pagetype=\\"content-landing\\" class=\\"footer-category-section-link \\" href=\\"/en/business\\">
\t\t\t\tBusiness
\t\t\t</a>
\t\t\t<a data-gacategory=\\"More\\" data-gatext=\\"Health\\" data-pagetype=\\"content-landing\\" class=\\"footer-category-section-link \\" href=\\"/en/health-wellness\\">
\t\t\t\tHealth
\t\t\t</a>
\t\t\t<a data-gacategory=\\"More\\" data-gatext=\\"Hurricane\\" data-pagetype=\\"hurricane\\" class=\\"footer-category-section-link \\" href=\\"/en/hurricane\\">
\t\t\t\tHurricane
\t\t\t</a>
\t\t\t<a data-gacategory=\\"More\\" data-gatext=\\"Leisure and Recreation\\" data-pagetype=\\"content-landing\\" class=\\"footer-category-section-link \\" href=\\"/en/leisure-recreation\\">
\t\t\t\tLeisure and Recreation
\t\t\t</a>
\t\t\t<a data-gacategory=\\"More\\" data-gatext=\\"Severe Weather\\" data-pagetype=\\"severe-weather\\" class=\\"footer-category-section-link \\" href=\\"/en/us/severe-weather\\">
\t\t\t\tSevere Weather
\t\t\t</a>
\t\t\t<a data-gacategory=\\"More\\" data-gatext=\\"Space and Astronomy\\" data-pagetype=\\"content-landing\\" class=\\"footer-category-section-link \\" href=\\"/en/space-news\\">
\t\t\t\tSpace and Astronomy
\t\t\t</a>
\t\t\t<a data-gacategory=\\"More\\" data-gatext=\\"Sports\\" data-pagetype=\\"content-landing\\" class=\\"footer-category-section-link \\" href=\\"/en/sports\\">
\t\t\t\tSports
\t\t\t</a>
\t\t\t<a data-gacategory=\\"More\\" data-gatext=\\"Travel\\" data-pagetype=\\"content-landing\\" class=\\"footer-category-section-link \\" href=\\"/en/travel\\">
\t\t\t\tTravel
\t\t\t</a>
\t\t\t<a data-gacategory=\\"More\\" data-gatext=\\"Weather News\\" data-pagetype=\\"news\\" class=\\"footer-category-section-link \\" href=\\"/en/weather-news\\">
\t\t\t\tWeather News
\t\t\t</a>
\t\t\t<a data-gacategory=\\"More\\" data-gatext=\\"Winter Center\\" data-pagetype=\\"winter-weather\\" class=\\"footer-category-section-link \\" href=\\"/en/us/winter-weather\\">
\t\t\t\tWinter Center
\t\t\t</a>
</div>

\t\t\t\t\t\t<div class=\\"footer-social footer-social-tablet\\">
\t<a
\t\tclass=\\"social-link\\"
\t\tdata-gatype=\\"outbound\\"
\t\tdata-gacategory=\\"Downloads\\"
\t\tdata-galink=\\"https://downloads.accuweather.com/\\"
\t\thref=\\"https://downloads.accuweather.com/\\"
\t\ttarget=\\"_blank\\"
\t\trel=\\"noopener noreferrer\\"
\t>
\t\t<svg data-src=\\"/images/socialicons/downloads.svg\\" class=\\"social-icon\\" alt=\\"Social Icon\\" width=\\"32\\" height=\\"32\\" viewBox=\\"0 0 36 36\\"><g fill=\\"none\\" fill-rule=\\"evenodd\\"><path d=\\"M18 0C8.053 0 0 8.053 0 18s8.053 18 18 18 18-8.053 18-18S27.947 0 18 0Z\\" fill=\\"#EE5723\\"/><path d=\\"M12.88 12.947a7.243 7.243 0 0 1 10.24 0c2.813 2.826 2.827 7.413 0 10.226-2.827 2.827-7.413 2.827-10.227 0-2.826-2.813-2.826-7.4-.013-10.226ZM18 9.907c-4.467 0-8.107 3.64-8.107 8.106 0 4.467 3.64 8.107 8.107 8.107 4.467 0 8.107-3.64 8.107-8.107 0-4.48-3.64-8.106-8.107-8.106Zm10.12 2.213-3.52-.76-.773-3.507L20.4 8.947l-2.427-2.654L15.56 8.96l-3.427-1.08-.76 3.52-3.506.773L8.973 15.6 6.32 18.027l2.667 2.413-1.08 3.427 3.52.76.773 3.506 3.427-1.093 2.426 2.653 2.414-2.666 3.426 1.08.76-3.52 3.507-.787-1.107-3.427 2.654-2.426-2.667-2.414 1.08-3.413Z\\" fill=\\"#FFF\\"/></g></svg>
\t</a>
\t<a
\t\tclass=\\"social-link\\"
\t\tdata-gatype=\\"social\\"
\t\tdata-gacategory=\\"Facebook\\"
\t\tdata-galink=\\"https://www.facebook.com/AccuWeather\\"
\t\thref=\\"https://www.facebook.com/AccuWeather\\"
\t\ttarget=\\"_blank\\"
\t\trel=\\"noopener noreferrer\\"
\t>
\t\t<svg data-src=\\"/images/socialicons/facebook.svg\\" class=\\"social-icon\\" alt=\\"Social Icon\\" width=\\"32\\" height=\\"32\\" viewBox=\\"0 0 36 36\\"><g fill-rule=\\"nonzero\\" fill=\\"none\\"><path d=\\"M20.8 5.069c-9.946 0-11.514 4.3-11.514 14.247 0 8.092-1.997 5.082 5.346 7.352C16.315 27.188 16.145 36 18 36c1.72 0 3.383-.24 4.957-.69 2.408-.688 4.466-4.135 6.173-10.342 1.644-2.179 2.466-4.696 2.466-7.55 0-9.947-.85-12.35-10.796-12.35Z\\" fill=\\"#FFF\\"/><path d=\\"M18 0C8.053 0 0 8.053 0 18c0 9.893 7.987 17.933 17.867 18V23.653h-4.16V18.84h4.16v-3.547c0-4.12 2.52-6.36 6.186-6.36 1.76 0 3.267.134 3.707.187v4.307h-2.547c-2 0-2.386.946-2.386 2.346v3.067H27.6l-.627 4.813h-4.146v11.694C30.427 33.227 36 26.267 36 18c0-9.947-8.053-18-18-18Z\\" fill=\\"#4167B2\\"/></g></svg>
\t</a>
\t<a
\t\tclass=\\"social-link\\"
\t\tdata-gatype=\\"social\\"
\t\tdata-gacategory=\\"Twitter\\"
\t\tdata-galink=\\"https://twitter.com/BreakingWeather\\"
\t\thref=\\"https://twitter.com/BreakingWeather\\"
\t\ttarget=\\"_blank\\"
\t\trel=\\"noopener noreferrer\\"
\t>
\t\t<svg data-src=\\"/images/socialicons/twitter.svg\\" class=\\"social-icon\\" alt=\\"Social Icon\\" width=\\"32\\" height=\\"32\\" viewBox=\\"0 0 36 36\\"><g fill-rule=\\"nonzero\\" fill=\\"none\\"><path d=\\"M18 0C8.053 0 0 8.053 0 18s8.053 18 18 18 18-8.053 18-18S27.947 0 18 0Z\\" fill=\\"#1DA1F3\\"/><path d=\\"M26.904 14.316c.012.183.012.376.012.57 0 5.774-4.294 12.448-12.14 12.448a11.96 11.96 0 0 1-6.538-1.96c.33.046.672.058 1.014.058a8.424 8.424 0 0 0 5.296-1.868c-1.868-.034-3.44-1.298-3.987-3.04.262.056.524.079.798.079.387 0 .763-.057 1.127-.16-1.947-.398-3.428-2.163-3.428-4.293v-.057c.581.33 1.23.524 1.936.547a4.417 4.417 0 0 1-1.902-3.645c0-.797.205-1.549.581-2.198 2.107 2.654 5.25 4.385 8.792 4.567a4.717 4.717 0 0 1-.114-.99c0-2.415 1.914-4.374 4.26-4.374 1.23 0 2.335.535 3.109 1.378a8.26 8.26 0 0 0 2.71-1.06 4.3 4.3 0 0 1-1.879 2.415A8.4 8.4 0 0 0 29 12.05c-.535.877-1.264 1.64-2.096 2.266Z\\" fill=\\"#FFF\\"/></g></svg>
\t</a>
</div>

\t\t\t\t</div>
\t\t\t</div>
\t</div>
</div>

\t</span>
\t<div class=\\"footer-legalese \\">
\t<div class=\\"footer-copyright\\">
\t\t<span>
\t\t\t&#xA9; 2024 AccuWeather, Inc. &quot;AccuWeather&quot; and sun design are registered trademarks of AccuWeather, Inc. All Rights Reserved.

\t\t</span>
\t</div>
\t<div id=\\"footer-terms\\" class=\\"footer-terms\\">
\t\t<a
\t\t\tdata-ga=\\"Terms of Use\\"
\t\t\thref=\\"/en/legal\\"
\t\t\ttarget=\\"_blank\\"
\t\t>
\t\t\tTerms of Use
\t\t</a>
\t\t|
\t\t<a
\t\t\tdata-ga=\\"Privacy Policy\\"
\t\t\thref=\\"/en/privacy\\"
\t\t\ttarget=\\"_blank\\"
\t\t>
\t\t\tPrivacy Policy
\t\t</a>
\t\t|
\t\t<a
\t\t\tdata-ga=\\"Cookie Policy\\"
\t\t\thref=\\"/en/cookiepolicy\\"
\t\t\ttarget=\\"_blank\\"
\t\t>
\t\t\tCookie Policy
\t\t</a>
\t\t\t<span>|</span>
\t\t\t<a
\t\t\t\tclass=\\"ccpa-link \\"
\t\t\t\tdata-ga=\\"CCPA Do Not Sell\\"
\t\t\t>
\t\t\t\t<span class=\\"opt-out\\">Do Not Sell or Share My Personal Information</span>
\t\t\t\t<span class=\\"opt-out-transition\\">
\t\t\t\t\t<img data-image=\\"https://www.awxcdn.com/adc-assets/images/icons/orange-tick.svg\\" alt=\\"checkmark\\" />
\t\t\t\t\t<span>Confirmed</span>
\t\t\t\t</span>
\t\t\t\t<span class=\\"opt-in\\">Not Selling Your Data</span>
\t\t\t</a>
\t</div>
</div>

</div>

\t\t<div class=\\"privacy-policy-banner\\" data-banner-order=\\"0\\" data-banner-delay=\\"0\\" id=\\"privacy-policy-banner\\">
\t\t<div class=\\"banner-body\\">
\t\t\t<p>
\t\t\t\tWe have updated our <a id=\\"privacy-policy-banner-privacy-link\\" href=\\"/en/privacy\\" target=\\"_blank\\">Privacy Policy</a> and <a id=\\"privacy-policy-banner-cookie-policy-link\\" href=\\"/en/cookiepolicy\\" target=\\"_blank\\">Cookie Policy</a>.
\t\t\t</p>
\t\t\t<div class=\\"banner-button policy-accept\\">I Understand</div>
\t\t</div>
\t</div>

\t
\t
\t\t<div class=\\"pushly-prompt-custom\\" data-banner-order=\\"1\\" data-banner-delay=\\"500\\" style=\\"display: none;\\" id=\\"pushly-prompt-custom\\">
\t<div class=\\"banner-body\\">
\t\t<div>
\t\t\t<p>Get AccuWeather alerts as they happen with our browser notifications.</p>
\t\t</div>
\t\t<div>
\t\t\t<button class=\\"pushly-prompt-buttons-allow banner-enable-button\\">Enable Notifications</button>
\t\t</div>
\t\t<button class=\\"pushly-prompt-buttons-dismiss banner-dismiss-button\\">No, Thanks</button>
\t</div>
</div>

<div id=\\"pushly-enabled-banner\\" class=\\"pushly-banner enabled-banner pushly-prompt-custom\\" style=\\"display: none;\\">
\t<div class=\\"banner-body\\">
\t\t<p class=\\"title\\">
\t\t\t<span class=\\"checkmark-wrapper\\">
\t\t\t\t<svg class=\\"icon-check\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" alt=\\"\\" viewBox=\\"0 0 24 24\\"><path d=\\"M7.832 17.496L2.142 11.9.205 13.792l7.627 7.503L24.205 5.188l-1.924-1.893z\\"/><use fill=\\"#000\\" fill-rule=\\"evenodd\\" /></svg>
\t\t\t</span>
\t\t\tNotifications Enabled
\t\t</p>
\t\t<p>
\t\t\tThanks! We&#x2019;ll keep you informed.
\t\t</p>
\t</div>
</div>

\t
</div>


\t<script>
\t\t// Check for third party cookie support
\t\tconst thirdPartyIframe = document.createElement('iframe');
\t\tthirdPartyIframe.setAttribute(
\t\t\t'src',
\t\t\t'https://www.awxcdn.com/adc/3rdpartycheck.html'
\t\t);
\t\tthirdPartyIframe.setAttribute('style', 'width:0;height:0;display:none');
\t\tdocument.body.appendChild(thirdPartyIframe);
\t</script>

\t\t

\t\t\t<script charset=\\"utf-8\\" src=\\"https://www.awxcdn.com/adc-assets/bundles/city.current-weather-desktop.4881b03ef4186ced7c3e.js\\" async></script>
\t\t<script charset=\\"utf-8\\" src=\\"https://www.awxcdn.com/adc-assets/bundles/4488.a937c9ec499b7a907d8a.js\\" async></script>
\t\t<script charset=\\"utf-8\\" src=\\"https://www.awxcdn.com/adc-assets/bundles/8411.db12ef87485231b2e012.js\\" async></script>

\t\t\t\t<script charset=\\"utf-8\\" src=\\"https://www.awxcdn.com/adc-assets/bundles/legacy-header.3f0a52ca1578b1e543c8.js\\" async></script>



\t

\t<script async src=\\"https://securepubads.g.doubleclick.net/gampad/adx?iu=/6581/web/us/video_player/weather/current&amp;sz=3x3&amp;c=638573721412307613&amp;m=text/javascript&amp;t=fdate%3d20240723%26lang%3den-us%26ut%3d0%26advelvet%3d18%26bot%3d0%26pgview%3d5%26partner%3daccuweather%26ufdb%3dMARI%26city%3dMarina%26country%3dUS%26state%3dCA%26dma%3d828%26key%3d337145%26zip%3d939XX%26browser%3dcfnetwork&#x2B;app%26connection%3dcable_vhigh_5000%26wx_seg%3d108105100%2c101103100%2c109101100%2c108103102%2c100108101%2c102102100%2c110100100%2c102101100%2c108102100%2c101108100%2c100106104%2c103101104%2c999100000%2c101100100%2c102100100%2c108104101%2c102103100%2c102104100%2c101107100%2c101105100%2c101104101%2c101106101%2c100109107%2c101101104%2c100109104%2c109100104%2c105100104%2c101102100%2c107100104%2c109104102%2c108100104%2c109102104%2c109106104%2c100111101%2c103100104%2c107101104%2c108101104%2c100113102%2c109105102%2c110102101%2c109103104%2c104100104%2c104101104%2c100112103%26cuhd%3d88%26cuhi%3d61%26cuuv%3d5%26cuwd%3d9%26cuwx%3d1%26realfeel%3d60%2ca70%26fc1hi%3d60%26fc1lo%3d57%26fc1wx%3d2%26lfscategory%3dfog%26lfsday%3d3%26lfsseverity%3d5%26lfs%3d5_fog_3%26pt%3d0%26userid%3dactive%26userid3p%3dactive%26iabctax%3dIAB12-3%2cIAB15-10%2cIAB20-8%2c390%2c660&amp;ppid=b292ff24a7bf4fffb9b5ee4da18c7328&amp;userid3p=active\\"></script>

\t

\t\t<img src=\\"https://sb.scorecardresearch.com/p?cs_fpid=b292ff24-a7bf-4fff-b9b5-ee4da18c7328&amp;cs_fpit=c&amp;c1=2&amp;c4=https%3a%2f%2fwww.accuweather.com%2fen%2fus%2fmarina%2f93933%2fcurrent-weather%2f337145&amp;c2=6005068&amp;c7=https%3a%2f%2fwww.accuweather.com%2fen%2fus%2fmarina%2f93933%2fcurrent-weather%2f337145&amp;c8=Marina%2C%20CA%20Current%20Weather%20%7C%20AccuWeather&amp;c9=&amp;cs_ucfr=\\" alt=\\"ComScore\\" />

\t
\t

\t
<script>
\tvar isPushlyEnabled = true;
</script>

\t<script src=\\"https://cdn.p-n.io/pushly-sdk.min.js?domain_key=16if7iQ5tgH1FcRA4cUeejyVcdf5guIAEV9R\\" defer onerror=\\"window.pushlyCallbackError=true;\\" ></script>

\t


\t\t<script>
\t\tfunction callBlockthroughScript() {
\t\t\tconst scriptEl = document.getElementById('bt_bootstrap_2.0')
\t\t\tif (!scriptEl) {
\t\t\t\tconst s = document.createElement(\\"script\\");
\t\t\t\tel = document.getElementsByTagName(\\"script\\")[0];
\t\t\t\ts.setAttribute('id', 'bt_bootstrap_2.0');
\t\t\t\ts.async = true;
\t\t\t\ts.src = \\"//accuweather-com.videoplayerhub.com/btTag.js?w=5760049299324928\\";
\t\t\t\tel.parentNode.insertBefore(s, el);
\t\t\t}
\t\t};
\t\twindow.addEventListener('load', callBlockthroughScript);

\t\t\tsetTimeout(callBlockthroughScript, 15000);
\t\t\t\t</script>

\t

\t<script>
\ttry {
\t\t;
\t} catch (error) {}
\t</script>
</body>
</html>`

function simplifyHtml(html) {
  // Sanitize the input HTML
  const sanitizedHtml = sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      'img': ['alt']
    },
    exclusiveFilter: function(frame) {
      // Remove empty elements
      return !frame.text.trim() && frame.tag !== 'img';
    }
  });

  // Remove excessive whitespace
  const cleanedHtml = sanitizedHtml.replace(/\s+/g, ' ').trim();

  return cleanedHtml;
}

console.log(simplifyHtml(htmlContent));

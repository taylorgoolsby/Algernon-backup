# Algernon AI

A free and open source iOS app for personal data analysis and visualization.

## Features

Features are broken down into 3 screens, Messages, Timeline, and Embedding Space Viewer.

The state of each screen is maintained when it is not displayed and recovered when you return to it.

### Messages

The Messages screen is a chat interface that allows users to interact with Algernon AI. Submitting a message posts a job. This allows a long running process to be non-blocking, allowing the user to continue to submit more information while previous jobs are still running. If we restrict ourselves to only text generations, then each job is a single text generation, which can a text context window as the input. The context window contains the information that the user just posted, but some of the context window is reserved for information from other sources. One of these sources is previous messages. Maybe 100 messages back into the past, the 100 pairs of "user request" -> "ai response", pairs which are completed. This is called the "message list" section of the context window. 

All sections of the context window are:

- user request
- message history [100]
- short term memory
- long term memory
- internet results

The chat interface consists of a scrollview of messages. Messages which are still processing will have spinners. There might be a spinner for processing of inputs, like images or audio. The agent response text box will display a spinner. You can still see and click the x button for the agent or user message, and this will cancel the job along with any processes it spawned.

Keep in mind things like message history, short term memory, and long term memory are only updated when prior messages are completed, as these sections of the context window can be thought of as accumulators of past information.

Internet results are determined for the current user request, so these are always fresh on every post.

### Emebedding Space Viewer

The embedding space viewer is to the right. Swipe or tap the icon in the top right corner to cause the carousel to reveal the page on the right hand side to appear, which is the embedding space viewer.

This page loads in at the depth level you were previously at. It is a simple way of navigating the space of information in your app.

Every post submitted is converted into an ordered list of embeddings. An embedding is a unit arrow in a 384-dim space. Each direction in this multidimensional space represents some quality an object can have, like "good"-ness, or "bad"-ness. The embedding for good is usually opposite the embedding for bad, they point in opposite directions, but the embedding for evil is also opposite of good, but in the same general direction as bad.

This viewer is in 3D, but the original data is in 384-dimensional space. To render it in 3D, we use PCA. This is a simple algorithm which involves standing at the center of all the data points you are performing PCA on, and looking in all directions, and choosing the direction which has the most variance. Variance is a measure of not just how far data reaches out in that direction, but also how many points are in that direction. If these are data points of your thoughts, each PCA axis represents something you think of a lot. These are orthogonal interests you have, or orthogonal ways of thinking. It's a dimension along embedding space that you have greatest variance in, an axis you have the greatest dynamic range. 

PCA 1, the major semiaxis of all your data, when zoomed all the way out, snaps to the left-right screen direction. If you zoom in or out, it is the window slice of the view region over PCA 1 that changes, so it appears that points scale on PCA 1. This causes the PCA 1 difference between points to become more apparent when zoomed in. This is useful because PCA 1 the axis you naturally think of the most, so maybe ordering your data on this axis is a convencience.

PCA 2 and 3 are the minor semiaxes of your data. If we think of how we approach problem solving, PCA 1 might be the axis along which you use first, and PCA 2 and 3 are the axes you use second and third. It's like, 20-questions to find a solution. These 20 questions are binary choices, where each choice are two words whose embeddings are opposite of each other in the embedding space. We would present these 20 questions in order of PCA 1, 2, and 3.

Another reason we pin the zoom to scale only PCA 1 is to introduce high-dim data manipulation starting small. At each zoom level, everything is aligned along PCA 1, and the entirety of PCA 2 and 3 are free to rotate around the scaled PCA 1. Already with this simple interface (PCA to 3D the entire data set and then k=2 k means), we can select one of the two clusters, zoom into it in this manner (only scaling PCA 1), and repeat at any zoom level. This allows us to explore how things are related to each other along PCA 1, the overarching axis of your thoughts.

But there is another way to scale, where when you select a cluster, the cluster points are passed through k means and PCA, PCA aligned bounding box of that cluster's ellipsoid semiaxes becomes the world bounding box, and k means and PCA is repeated

The 3x3 covariance matrix of the PCA reduced points is obtained using SVD, U * S * VT, where S gives the eigenvalues along the diagonal. sqrt(an_eigenvalue) is a standard deviation, and is also an ellipsoid semiaxis length. That means the eigenvalue is a variance. The eigenvectors are found in U. Be mindful that sgesvd and all other Accelerate functions are column major, but all inputs and outputs to the obj-C funcions in ClusteringAndEllipsoids.m are row-major.

This means, the 3x3 covariance matrix obtained from ClusteringAndEllipsoids.m is always defined in a basis relative to 1, the identity. Here, the identity is flipped during rendering. Y and Z are exchanged, and Z is negated.

So the center of a cluster, its mean, or the centroid, along with its 3x3 covariance matrix, defines an ellipsoid in the identity space, the 3D space defined on [-1, 1] on each axis. cameraForward is [0, 0, 1].

The mass is distributed equally among clusters, and this is represented mathematically by multiplying a scalar of sqrt(det(cov3x3)).

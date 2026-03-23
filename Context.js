//If you haven't installed any other scripts, delete them all and paste this one in. If you have, look at the line with the // comment below; it should be left roughly the same.

const modifier = (text) => {
    text = StoryCardExtensionContext(text); //must be before "return {" and after "const modifier = (text) => {"
    return { text };
};
modifier(text);
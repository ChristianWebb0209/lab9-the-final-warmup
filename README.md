# lab9-the-final-warmup

In this lab we are fixing the bad code prof gives us and making it beautiful.

# Link:

https://690c1ed27f0bd5ccead1f43f--lab9-the-final-warmup.netlify.app/

# Thoughts

This lab is a good reminder that most of our work time as Software Engineers is reading code, followed by planning, making docs, writing tests, managing the git repo, etc. I really liked getting to use git a bunch more in this lab. 

I learned that adding Fixes # to a commit line automatically connects that commit to the issue of that number on git. I want to get to use issues more, since I know from looking at open-source projects, issues are often formatted with in depth descriptions, how you can replicate the issue, console logs, and suggested approaches / attempted approaches. I felt like most of these weren't really relevant here, but in our main project I'm sure they will be.

I also experimented around with JSDocs a lot, I learned that there are tons of different templates for the automated doc making process, and tons of other ways to configure this process.

The repo had terrible naming conventions, I fixed these and tried to use useful git commit messages. I try to not be overly verbose or descriptive, since I know in reality we use commit messages to scan back through our commit history and look for specific things, so short and punctual is my guideline for commit messages.

I built out e2e and unit testing. For these I had to mock the localStorage. For writing tests, rather than going for the most coverage, I like to target the most crucial parts or the vulnerabilities. After writing so many tests, I start to realize that a lot of them can be done without and are in fact often useless.

# Personal Modifications

I wanted to work more with CSS so I rebuilt everything to use a jungle theme. I got refactored everything to be on one main stylesheet then refactored that to use global variables. I asked ChatGPT to fill these variables with a jungle theme, and retried until I found colors I liked. I rebuilt a lot of the CSS to feel smoother and look more slick. I experimented with adding assets. Getting these to upload correctly to netlify was a bit of a hassle, and there is a banana image that I still can't get to upload. I also made it so when you click a banana will fly out spinning in a random direction.
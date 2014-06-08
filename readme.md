ZUP Painel
=========

This document describes how to install, work and deploy the lastest version of ZUP Painel.

## Table of contents

- [How to install](#how-to-install)
- [Our branching model](#out-branching-model)
- [Working on new features](#working-on-new-features)
    - [Creating a new branch](#creating-a-new-branch)
    - [Testing your code](#testing-your-code)
    - [Sending a pull request to develop](#sending-a-pull-request-to-develop)
    - [Merging your feature branch into develop](#merging-your-feature-branch-into-develop)
- [Working on bug fixes](#working-on-bug-fixes)

## How to install
ZUP-Painel uses [Yeoman](http://yeoman.io/) for its development process. All you need is to simply install Yeoman requirements: yo, grunt, bower and its AngularJS generator.

    $ npm install -g yo
    $ npm install -g grunt-cli bower
    $ npm install -g generator-angular

Check out [Yeoman getting started](http://yeoman.io/gettingstarted.html) page for more information.

Then it's time to install our app:

```
$ git clone git@github.com:panchodev/zup-painel.git
$ cd zup-painel
$ bower install
$ grunt serve
```

You should ~~hopefully~~ see the app running beautifully in your browser.

## Our branching model
In our team, we use two main branches to host the code with an infinite lifetime:
* master
* develop

At *origin/master* we keep our production-ready code. *origin/develop* is used to test code that will be delivered to the next release, where it will be merged into *master*. You shouldn't commit changes directly into the main branches. To work on new features or on bug fixes, check out the guide below.

## Working on new features
Working on new features should be easy and painless. Each 'feature' is a **new branch** in the project. This way, each developer may work with the latest code available, without having to worry about merging problems or faulty code.

In our team we use [Attlasian JIRA](https://www.atlassian.com/software/jira) to keep track of tasks/bugs. For better organization, each new feature branch should be named with the issue ID.

### Creating a new branch

Let's suppose we have the issue named *"ZUP-232 add new images to the project"*. To work on this issue, you simply need to create a new branch called ZUP-232:

    $ git checkout -b 'ZUP-232' develop

This command creates a new branch from develop. From now on, you're free to work on your issue and commit changes. As soon as you commit something, please send it to origin.

    $ git push

### Testing your code

Every commit pushed to any branch at *origin* will be tested by [Wercker](http://wercker.com/). Wercker is a powerful tool for testing and deploying applications and we are proud to use it!

After you push each modification to your new brunch at Github, Wercker will automatically test it. If your test is sucessfull, you will be able to deploy the code to our **staging enviroment**. To do so, follow the steps:

1. Access [our app](https://app.wercker.com/#applications/5391491985147b684f066c3a) page at Wercker
2. Select the latest tested build from the list
3. Deploy to our **staging enviroment** by selecting it on the dropdown menu at the right-top corner of the screen

After the deploy is sucessful, you'll be able to test your new feature live at http://staging-zup-painel.herokuapp.com/.

### Sending a pull request to develop

After you're done testing (and reviewing your code!) you should create a pull request to merge your branch feature into the branch develop. Its simple:

1. Compare the base branch (develop) with your feature branch (ex.: ZUP-232)
2. REVIEW.THE.CODE.THOROUGHLY. We don't want any problems in the future :)
3. Create a meaningful title for the pull request (with the issue ID on the title, plase)
4. Describe anything useful on the content that you find important.
5. Click on the big green button!

>Can't seem to find how to compare the branches? Just change the link to your issue ID: https://github.com/panchodev/zup-painel/compare/develop...ZUP-232

After you create a new pull request, the code will be put under review by another member of the team.

### Merging your feature branch into develop

We believe in writing quality code. Each pull request should be evaluated carefully. After you're safe that your code was tested and works as expected, you should merge the pull request. If possible, it's always good to have another member of the team to do so. This way, we can keep sync of each members work and comment on how we can do things better!

Github can do the merging automatically. If by any ways that is not possible, you can also do it by the command line:

    $ git checkout develop
    $ git merge --no-ff 'ZUP-232'
    $ git push origin develop

After a successfull merge into develop, Wercker will automatically **test and deploy** the latest PR. The new code into develop will be deployed to http://testing-zup-painel.herokuapp.com/.

### Cleaning up

When you're done working on your feature, you should clean up the branch you created. Locally you can delete your branch using the command:

    $ git branch -d 'ZUP-232'

It's also good to delete the branch at Github, so we don't accumulate unnecessary versions of the app. To do so just go to the [branches page](https://github.com/panchodev/zup-painel/branches).

## Working on bug fixes

The process to fix bugs into your already merged code shouldn't be different then the listed above. For every bug, you should create a new issue at our JIRA project board and create a new branch.

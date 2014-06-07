ZUP Painel
=========

This document describes how to install, work and deploy the lastest version of ZUP Painel.

## How to install
ZUP-Painel uses [Yeoman](http://yeoman.io/) for it's development process. All you need is to simply install Yeoman requirements: yo, grunt, bower and it's AngularJS generator.

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
In our team, we use two main branches to host the code with an infinte lifetime:
* master
* develop

At *origin/master* we keep our production-ready code. *origin/develop* is used to test code that will be delivered to the next release, where it will be merged into *master*. You shouldn't commit changes directly into the main branches. To work on new features or on bug fixes, check out the guide below.

## Working on new features
Working on new features should be easy and painless. Each 'feature' is a **new branch** in the project. This way, each developer can work with the lastest code available, without having to worry about merging problems or faulty code.

In our team we use [Attlasian JIRA](https://www.atlassian.com/software/jira) to keep track of tasks/bugs. For better organization, each new feature branch should be named with the issue ID.

Let's suppose we have the issue named *"ZUP-232 add new images to the project"*. To work on this issue, you simply need to create a new branch called ZUP-232:

    $ git checkout -b 'ZUP-232' develop

This command simply creates a new branch from develop. From now on, you're freely to work on your issue and commit changes.

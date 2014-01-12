"use strict"

module.exports = (grunt) ->

  # load all grunt tasks
  require("matchdep").filterDev("grunt-*").forEach grunt.loadNpmTasks

  grunt.initConfig

    # load package json
    pkg: grunt.file.readJSON "package.json"

    coffeelint:
      options:
        arrow_spacing:
          level: "error"
        no_empty_param_list:
          level: "error"
        no_unnecessary_fat_arrows:
          level: "error"
        space_operators:
          level: "error"
        indentation:
          value: 2
          level: "error"
        max_line_length:
          level: "ignore"
      build: ["Gruntfile.coffee", "src/coffee/**/*.coffee"]

    coffee:
      build:
        expand: true
        cwd: "src/coffee"
        src: "**/*.coffee"
        dest: "build/js"
        ext: ".js"

    uglify:
      build:
        preserveComments: "some"
        expand: true
        src: "build/js/bootstrap-switch.js"
        ext: ".min.js"

    less:
      build:
        files:
          "build/css/bootstrap2/bootstrap-switch.css": "src/less/bootstrap2/bootstrap-switch.less"
          "build/css/bootstrap3/bootstrap-switch.css": "src/less/bootstrap3/bootstrap-switch.less"

    cssmin:
      build:
        expand: true
        src: ["build/css/bootstrap2/bootstrap-switch.css", "build/css/bootstrap3/bootstrap-switch.css"]
        ext: ".min.css"

    usebanner:
      build:
        options:
          banner: "/* ========================================================================\n" +
          " * <%= pkg.name %> - v<%= pkg.version %>\n" +
          " * <%= pkg.homepage %>\n" +
          " * ========================================================================\n" +
          " * Copyright 2012-2013 <%= pkg.author.name %>\n" +
          " *\n" +
          " * ========================================================================\n" +
          " * Licensed under the Apache License, Version 2.0 (the \"License\");\n" +
          " * you may not use this file except in compliance with the License.\n" +
          " * You may obtain a copy of the License at\n" +
          " *\n" +
          " *     http://www.apache.org/licenses/LICENSE-2.0\n" +
          " *\n" +
          " * Unless required by applicable law or agreed to in writing, software\n" +
          " * distributed under the License is distributed on an \"AS IS\" BASIS,\n" +
          " * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n" +
          " * See the License for the specific language governing permissions and\n" +
          " * limitations under the License.\n" +
          " * ========================================================================\n" +
          " */\n"
        files:
          src: ["build/**/*"]

    jshint:
      all: ["*.json"]

    bump:
      options:
        files: ["package.json", "bower.json"]
        commitFiles: ["-a"]
        push: false

  grunt.registerTask "build", ["coffeelint", "coffee", "uglify", "less", "cssmin", "usebanner"]
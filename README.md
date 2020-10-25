# 👨🏼‍🚀 aka
aka is a friendly **cli** to run gist sharable bash commands.

[![npm version](https://badge.fury.io/js/%40owvy%2Faka.svg)](https://badge.fury.io/js/%40owvy%2Faka)


## Installation

```shell
npm install -g @owvy/aka
aka clone [gist_id]
````

Create an [`aka.yml`](https://gist.github.com/) file.
`````yaml
## Simple Script
what-time:
  desc: Print current time
  run: node -e 'console.log(new Date())'

## Scripts with vars
secret:
  desc: print my secret value
	run:
		- echo Multiple lines,
		- echo and this is my secret, {SECRET_VALUE}

## Sub-scripts
create:
  desc: A collection of scripts
  run:
    folder: mkdir {name}
		file: touch {name} && code {name}

## Scripts with base path
workspace:
	desc: My Workspace
	basePath: '~/workspace'
	run:
	 server: npm run server
	 db: docker-compose up
`````


## Usage

````shell
$ aka what-time

> Sun Oct 25 2020 22:41:07 GMT+0100 (Central European Standard Time)
`````

````shell
$ aka var add SECRET_VALUE=123
$ aka secret

> Multiple lines,
> and this is my secret, 123

`````


## Variables

Variables can be store globally and be accessed by any command:

```shell
 aka var add LOGIN_ID=MyID
 aka var add PASS=123pass!
```



## CLI

| Command        | Params           | Desc                                 |
| -------------- | ---------------- | ------------------------------------ |
| aka `clone`    | `gist_id`        | clone gist                           |
| aka `update`   | -                | update the current gist              |
| aka `list`     | -                | print available commands             |
| aka `var open` | -                | open variable file `(variables.yml)` |
| aka `var add`  | `VAR_NAME=value` | store global variable                |
| aka `var list` | -                | print all stored variables           |


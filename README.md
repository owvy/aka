# AKA ⚡️
AKA is a friendly CLI to run sharable bash commands.

[![npm version](https://badge.fury.io/js/%40owvy%2Faka.svg)](https://badge.fury.io/js/%40owvy%2Faka)


## Quickstart

Create your own [gist file](https://gist.github.com/) or clone one.
The ony requirement is to have: `aka.yml`

`npm install -g @owvy/aka`
`aka clone [gist_id]`

---

#### Aka Config

1. Simple Usage:

```yml
greeting:
  desc: random greeting
  run: echo howdy?
```

```shell
aka greeting
# > howdy?
```

2. With Variables:

```yml
greeting:
  desc: random greetings
  run: echo howdy {NAME}?
```

2.1 Use variable directly on the terminal:

```shell
aka greeting name=Johnny
# > howdy Johnny?
```

2.2 Use stored variable (see: [variables](#variables))

```shell
aka var add NAME=James
aka greeting
# > howdy James
```

---

#### BasePath

Set `basePath` to all the commands

```yml
web-project:
  desc: run my webapp stack
  basePath: ~/workspace/project
  run:
    frontend: npm run frontend
    api: npm run api
```

---

#### Nested config

Nested commands can also be used:

```yml
greeting:
  desc: random greetings
  run:
    howdy: echo howdy!
    bye: echo catch ya later
```

```yml
greeting:
  desc: random greetings
  run:
    howdy:
      desc: howdy echo
      run: echo howdy!
    bye:
      desc: bye echo
      run: echo catch ya later
```

```shell
aka greeting bye
# > catch ya later
```

---

#### Variables

variables can be store globally and any access at any command:

```shell
 aka var add LOGIN_ID=myID
 aka var add PASS=123pass!
```

[see more commands: CLI](#cli)

---

#### CLI

##### (Default Commands)

| Command        | Params           | Desc                                 |
| -------------- | ---------------- | ------------------------------------ |
| aka `clone`    | `gist_id`        | clone commands                       |
| aka `update`   | -                | update the current gist              |
| aka `list`     | -                | print available commands             |
| aka `var open` | -                | open variable file `(variables.yml)` |
| aka `var add`  | `VAR_NAME=value` | store global variable                |
| aka `var list` | -                | print all stored variables           |

##### PR, Comments & feedback are welcome :)

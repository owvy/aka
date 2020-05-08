(WIP)

# AKA

Aka is a friendly CLI to run sharable bash commands.

## Quickstart

~~`npm install -g @owvy/aka`~~

Usage Examples:

1. [Aka Config](#config)
2. [Usage](#usage)
3. [CLI Commands](#cli)

#### Config

```yml
what-time:
  run: node -e new Date()
  desc: Echo Current Time

du:
  run: docker-compose down & docker-compose up
  desc: Restart Docker project

secret:
  run: echo This is my secret, {SECRET_VALUE}
  desc: Echo my secret values

create:
  desc: Collection of create alias
  args:
    folder: mkdir {name}
    file: touch {name} && code {name}
```

#### Usage

1.  You can create your own _Gist_ file or can clone any other one, ony requirement is to have: `aka.yml`

2.  ~~Create your local config `aka local`~~

##### Run it

1. Command can be easily created given `run` and `desc` values, and they can be called as such:

```shell
 > aka what-time
 > aka du
```

2. Command also can be nested and it will be interpreted as **sub command**. To access **args** on the command is easily as: `{argName}`

```shell
> aka create folder name=my_folder
> aka create file name=playground.js
```

#### CLI

```js
> aka // log list of commands available
> aka clone GIST_ID // clone commands
> aka update // update current gist

// Variables
> aka var GLOBAL_VAR=1122 // add global variable from terminal
> aka var // open variable file
> aka var list // log variables
```

##### Important Notes

The commands: `clone`, `update` and `var` are reserved by the package, whenever there is a conflict the command from the gist will be discarded.

##### PR, Comments & feedback are welcome :)

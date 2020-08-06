# AKA 2.0

AKA is a friendly CLI to run sharable bash commands.

## Quickstart

Create your own [gist file](https://gist.github.com/) or clone one.
The ony requirement is to have: `aka.yml`

`npm install -g @owvy/aka`
`aka clone [gist_id]`

---

#### Aka Config

1. Simple Usage:

```yml
hello: # alias
  run: echo Hello World # bash command
  desc: Print Hello World # (Optional)
```

> ```shell
> > aka hello
> # echo: Hello World
> ```

2. With Variables:

```yml
ping: # alias
  run: ping {URL} -c 2 # bash command
  desc: Ping website # (Optional)
```

2.1 using the variable directly on the terminal:

> ```shell
> > aka ping url=www.google.com
> # echo: PING www.google.com:
> ```

2.2 store the variable globally (see: [variables](#variables))

> ```shell
> > aka var URL=www.google.com
> > aka ping
> # echo: PING www.google.com:
> ```

---

#### BasePath

Set `basePath` to all the commands from that list _if necessary_

```yml
run-project: # alias
	desc: run my fullstack project
	basePath: ~/workspace/project
	run:
	 frontend: npm run frontend
	 api: npm run api
```

---

#### Nested config

Nested commands can also be used:

```yml
say: # alias
  desc: Print Greetings # (Optional)
  run:
    gm: echo Good Morning!
    gn: echo Adios, Night!
```

```yml
say: # alias
  desc: Print Greetings # (Optional)
  run:
		gm:
		 desc: Say GM
		 run: echo Good Morning!
		gn:
		 say: Say GN
		 run: echo Adios, Night!
```

> ```shell
> > aka say gn
> # echo: Adios, Night!
> ```

---

#### Variables

variables can be store globally and any command can have access:

```shell
 # Create Variables
 > aka var LOGIN_ID=myID
 > aka var PASS=123pass!
```

[see more commands: CLI](#cli)

---

#### CLI

##### (Default Commands)

| Command        | Params           | Desc                                 |
| -------------- | ---------------- | ------------------------------------ |
| aka `clone`    | `gist_id`        | clone commands                       |
| aka `update`   | -                | update the current gist              |
| aka `list`     | -                | print available cmds                 |
| aka `var`      | -                | open variable file `(variables.yml)` |
| aka `var`      | `VAR_NAME=value` | store global variable                |
| aka `var list` | -                | print all stored variables           |

##### PR, Comments & feedback are welcome :)

# Installation process

## Before starting the fish, make sure you have the `Yarn` package manager installed;

### Go to the directory with the layout:

```
    cd example_layout
```

### Download all the dependencies described in package.json using the package manager:

```
    yarn install
```

### To add a new dependency, use the command:

`For major dependencies:`

```
    yarn add <package-name>
```

`For dependencies that are used in development:`

```
    yarn add <package-name> -D
```

### To remove the dependency, use the command:

```
    yarn remove <package-name>
```

# Scripts and tasks

### For development there are following commands

- Starting the development server, after executing the command, the site will open in the default browser

```
    yarn start
```

- Start compiling files from `. / Src` to`. / Build`

```
    yarn build
```
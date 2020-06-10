# Parser

> This is a simple parser, which uses first, follow and syntactic predictive table algorithms to compare a grammar with the past expression and verify that they are in the same context.

## Initialization

> With [npm](https://www.npmjs.com/):

```bash
npm run cleilton
```

> With [yarn](https://yarnpkg.com/):

```bash
yarn cleilton
```

## Usage

Here are some gramatics which are acceptable:

- S->ABCDE:A->a|0:B->b|0:C->c:D->d|0:E->e|0
- S->AB:A->aA|a:B->bB|b

**Each expression of gramatic will be splited by te ':' operator, and this gramatic only accepts lower case letters or epsilon symbol (terminal symbols) and upper case letters (variables)**.

After initializating the application, input a gramatic and hit enter to get the response of those algorithms.

## Contextualization

This project is just a college assignment for the compiler building class.

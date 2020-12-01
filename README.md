# EVA

## Descrição


## Instalação

```bash
$ yarn install
```

### Configurar o `.env`:
```bash
$ cp .env.example .env
```

### Configurar o banco de dados:

Crie o banco e os schemas da aplicação.

### Rodar a aplicação:

```bash
$ yarn start:dev
```

### Executar as migrations:
```bash
$ yarn typeorm migration:run
```

## Rodando a aplicação

```bash
# development
$ yarn start:dev

# production
$ yarn start:prod
```

## Rodando os Testes

### Unitário

```bash
$ yarn test
```

### E2E

```bash
$ yarn test:e2e
```

## Gerando Migrations

As migrations são geradas automaticamente a partir da modelagem em `domain/models/*`.
No entanto, algumas observações são importantes:

- O TypeORM usa o código compilado para criar a migration, logo, 
certifique-se que o mesmo, em `/dist`, está atualizado _(Pode-se fazer isso reiniciando a aplicação)_.
-  Ele também olhará o estado atual do banco para criar o que estiver diferente. 
Certifique-se que todas as migrations foram executadas antes de gerar.

```bash
$ yarn typeorm migration:generate -n <nome_da_migration>
```
## Rodando as Migrations geradas

```bash
$ yarn typeorm migration:run
```

# Copy Dynamic Breadcrumb

## Objetivo

Criar uma extensão para o Visual Studio Code capaz de copiar para o clipboard o breadcrumb atualmente exibido na barra superior do editor.

Esta extensão também é útil como ferramenta auxiliar para IA. Ao invés de apenas informar o nome do arquivo, o programador pode colar o breadcrumb completo correspondente à posição atual do cursor, indicando exatamente onde a IA deve analisar. Com isso, a IA pode localizar diretamente o contexto desejado (arquivo, classe, método, elemento XML etc.), reduzindo ou eliminando a necessidade de explorar o arquivo para descobrir onde está o trecho relevante. Isso torna as interações mais rápidas, diminui o consumo de contexto e reduz a chance de a IA interpretar ou analisar uma região diferente da pretendida.

O breadcrumb deve refletir exatamente a posição atual do cursor no arquivo.

Exemplo:

```
.ai
└── Jira
    └── abertos
        └── VM-2973
            └── cards-correlatos
                └── VM-2978.xml
                    └── rss
                        └── channel
                            └── item
                                └── comments
```

Texto copiado:

```
.ai > Jira > abertos > VM-2973 > cards-correlatos > VM-2978.xml > rss > channel > item > comments
```

---

# Funcionalidades

## Comando

Adicionar um comando chamado:

```
Copy Dynamic Breadcrumb
```

Ao ser executado, o comando deve copiar para o clipboard o breadcrumb correspondente à posição atual do cursor.

Caso não exista editor ativo, exibir uma mensagem apropriada.

---

## Menu de contexto

Adicionar o comando ao menu de contexto do editor.

O comando deve estar disponível quando existir um editor de texto ativo.

---

## Comportamento

O breadcrumb deve ser composto por:

1. caminho relativo do arquivo dentro do workspace;
2. símbolos que representam o contexto do cursor.

Exemplo:

```
src > Services > UserService.php > createUser > validateEmail
```

Outro exemplo:

```
README.md
```

Outro:

```
config > routes.php
```

Outro:

```
feed.xml > rss > channel > item > comments
```

---

## Atualização

O comando sempre deve considerar:

* arquivo atualmente ativo;
* posição atual do cursor.

Mover o cursor deve alterar o breadcrumb que será copiado.

Não deve existir cache.

---

## Clipboard

O comando deve copiar apenas texto simples.

Não adicionar:

* aspas;
* quebras de linha;
* caracteres extras.

Formato:

```
segmento1 > segmento2 > segmento3 > segmento4
```

---

# Implementação

A implementação fica livre, porém deve utilizar apenas APIs públicas do Visual Studio Code.

Caso o VS Code não disponibilize diretamente o breadcrumb, a extensão deverá reconstruí-lo utilizando:

* caminho relativo do arquivo;
* DocumentSymbolProvider;
* posição atual do cursor.

A reconstrução deve produzir o mesmo resultado visual apresentado pelo Breadcrumb do VS Code.

---

# Casos especiais

## Arquivo fora do workspace

Copiar somente o nome (ou caminho absoluto, caso seja a única informação disponível).

Exemplo:

```
teste.php
```

---

## Sem símbolos

Se o arquivo não possuir símbolos reconhecidos:

```
README.md
```

---

## Múltiplos cursores

Utilizar apenas o cursor principal (`selection.active`).

---

## Workspace com múltiplas pastas

Utilizar o caminho relativo à pasta (`WorkspaceFolder`) que contém o arquivo.

---

## Símbolos aninhados

O breadcrumb deve incluir toda a hierarquia.

Exemplo:

```
Classe
 └── método
      └── função local
           └── variável
```

Resultado:

```
Classe > método > função local > variável
```

---

# Critérios de aceitação

* O texto copiado é idêntico ao breadcrumb apresentado pelo VS Code.
* Funciona em qualquer linguagem que possua `DocumentSymbolProvider`.
* Funciona independentemente do tema utilizado.
* Não depende de parsing específico de nenhuma linguagem.
* Não depende da UI do VS Code.
* Funciona em Windows, Linux e macOS.

---

# Estrutura sugerida

```
extension.ts
commands/
    copyDynamicBreadcrumb.ts
services/
    BreadcrumbService.ts
utils/
    SymbolFinder.ts
```

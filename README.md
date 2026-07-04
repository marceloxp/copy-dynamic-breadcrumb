# Copy Dynamic Breadcrumb

Extensão para o Visual Studio Code que copia para o clipboard o **breadcrumb dinâmico** do editor — o caminho do arquivo combinado com a hierarquia de símbolos na posição atual do cursor.

Em vez de informar apenas o nome do arquivo, você cola um contexto preciso: **onde o arquivo está** e **em qual trecho do código o cursor está**. Isso é especialmente útil ao trabalhar com IA, porque reduz exploração desnecessária, economiza contexto e diminui a chance da ferramenta analisar a região errada do arquivo.

## O que é copiado

O breadcrumb reflete sempre o **editor ativo** e a **posição do cursor principal** (`selection.active`). Não há cache: cada execução recalcula o resultado com base no estado atual.

O texto copiado segue o formato:

```
{file_path}:{code_path}
```

| Parte       | Descrição                        | Separador |
| ----------- | -------------------------------- | --------- |
| `file_path` | Caminho do arquivo               | `/`       |
| `code_path` | Hierarquia de símbolos no cursor | ` > `     |

Quando não há símbolos reconhecidos na posição do cursor, apenas o caminho do arquivo é copiado (sem `:`).

## Como usar

### Menu de contexto do editor

Clique com o botão direito no editor e abra o submenu **Copy Dynamic Breadcrumb**:

```
Copy Dynamic Breadcrumb  ▶
                          ├── Relative Path
                          └── Absolute Path
```

### Paleta de comandos

- `Copy Dynamic Breadcrumb: Relative Path`
- `Copy Dynamic Breadcrumb: Absolute Path`

## Opções de cópia

### Relative Path

Usa o caminho do arquivo **relativo à pasta do workspace** que contém o arquivo (suporta workspaces com múltiplas raízes).

**Exemplo:**

```
data/feeds/catalog.xml:rss > channel > item > customfields
```

### Absolute Path

Usa o **caminho absoluto** do arquivo no sistema.

**Exemplo:**

```
/home/dev/projects/my-app/data/feeds/catalog.xml:rss > channel > item > customfields
```

## Exemplos

| Situação                             | Relative Path                                             | Absolute Path                                                                          |
| ------------------------------------ | --------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Arquivo na raiz, sem símbolos        | `README.md`                                               | `/home/dev/projects/my-app/README.md`                                                  |
| Arquivo em subpasta, sem símbolos    | `config/routes.php`                                       | `/home/dev/projects/my-app/config/routes.php`                                          |
| Classe e método no cursor            | `src/Services/UserService.php:createUser > validateEmail` | `/home/dev/projects/my-app/src/Services/UserService.php:createUser > validateEmail`    |
| XML com elementos aninhados          | `data/feeds/catalog.xml:rss > channel > item > comments`  | `/home/dev/projects/my-app/data/feeds/catalog.xml:rss > channel > item > comments`     |
| Arquivo fora do workspace (relativo) | `draft.php`                                               | `/tmp/draft.php`                                                                       |

## Como funciona

O VS Code não expõe uma API pública para ler o breadcrumb exibido na barra superior. A extensão o reconstrói usando apenas APIs públicas:

1. **Caminho do arquivo** — relativo ao `WorkspaceFolder` ou absoluto via `Uri.fsPath`
2. **Símbolos no cursor** — `DocumentSymbolProvider` (`vscode.executeDocumentSymbolProvider`)

Funciona em qualquer linguagem que forneça símbolos de documento (TypeScript, PHP, XML, etc.), sem parsing específico por linguagem e independente do tema ou da UI do VS Code.

## Requisitos

- Visual Studio Code `^1.125.0`
- Windows, Linux ou macOS

## Desenvolvimento

```bash
npm install
npm run compile
npm test
```

Para testar localmente, abra o projeto no VS Code e pressione **F5** para iniciar o Extension Development Host.

## Licença

Consulte o arquivo [LICENSE](LICENSE).

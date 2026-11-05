# Busca de conta Roblox

Na rota `/auth`, o botão **Encontrar minha conta Roblox** abre a busca por @usuário. O servidor consulta o perfil público, busca a imagem do avatar e devolve ID, nome de usuário, nome de exibição e link do perfil. O usuário confere os dados e escolhe **Confirmar e salvar** ou **Buscar outro usuário**.

A seleção é armazenada apenas neste navegador (`selected-roblox-profile`). Não é autenticação nem prova de titularidade. Nenhuma senha, cookie Roblox ou token de conta é solicitado. Para autenticação real, seria necessária uma integração de identidade separada.

## Ativar após atualizar o projeto

Como a busca usa uma nova rota no servidor, pare o processo antigo no PowerShell com **Ctrl+C** e execute novamente:

```powershell
& "C:\Users\robert\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" server.mjs 4174
```

Abra `http://127.0.0.1:4174/auth` e atualize a página. A aplicação precisa que o servidor tenha acesso à internet para consultar o Roblox. Hospedagem puramente estática não oferece essa rota; uma publicação online futura precisa hospedar o backend também.

## Implementação

- `roblox.mjs`: busca pública, validação, avatar, cache em memória de cinco minutos e limite de 12 buscas por minuto por endereço.
- `server.mjs`: rota `GET /api/roblox/user?username=...`.
- `dist/roblox-account.js`: busca, carregamento, confirmação, cancelamento e armazenamento local.
- `dist/roblox-account.css`: tela e modal responsivos, conforme a referência.

O nome pode começar com @. Entradas inválidas e usuários inexistentes têm mensagens específicas. Falhas na consulta e limite de requisições permitem tentar novamente. Se o avatar não estiver disponível, o perfil ainda pode ser selecionado. Respostas canceladas ou antigas não sobrescrevem uma busca nova. Dados exibidos são escapados; URLs de avatar precisam ser HTTPS no domínio rbxcdn.com.

## Fontes

[Busca pública de usuários](https://create.roblox.com/docs/cloud/reference/domains/users) e [avatar headshot](https://create.roblox.com/docs/cloud/reference/domains/thumbnails), na documentação Roblox.

## Validação

Testes automatizados cobrem nome válido/inválido, normalização, usuário inexistente, resposta incompleta, falha de rede, cache, limite de consultas e restrição de domínio do avatar. A tela e o estado que solicita reiniciar o servidor foram conferidos no navegador. A consulta real completa depende de reiniciar o processo antigo que está aberto no PowerShell do usuário.

#Документация BackEnd edaedet
Порт - **3000**. Адрес - **edaback.14-bit.ru**

## База Данных

Пароль сохраняем с динамической солью в виде хеша bcrypt.

###Типы юзера

UNVERIFIED -  зарегался, надо подверждение.
VERIFIED - подвержденный

##Запросы:
###Коды
Коды:
```
    1. Код 200 - успешно выполнено.
    2. Код 400 - ошибка при выполнении.
```
###/register

Зарегистрировать пользователя. Отправляем POST запрос в виде json: 

```json
{
  "login" : "example",
  "email" : "example",
  "pass" : "example"
}
```
Получаем ответ:

```json
{
  "code" : 200
}
```

###/login

Войти в аккаунт пользователя. Отправляем GET запрос в виде json:

```json
{
  "login" : "example",
  "pass" : "example"
}
```

Получаем ответ:

```json
{
  "code" : 200,
  "hash" : "example"
}
```
###/verification
Отправляем GET запрос в виде URL: 
```json
{
  "login" : "example",
  "data" : "example"
}
```
Получаем ответ:
```json
{
  "code" : 200
}
```

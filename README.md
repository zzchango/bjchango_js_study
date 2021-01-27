

# Project bjchango Study



## 요건사항

[server] : mysql +graphql

[front] : react-client (native-base, apollo-client)

추가 요건

-  Git 연동

- iOS, Android Native app (Camera) / Install

- iOS, Android Push noti



## 진행

- Nodejs 설치
- Nodejs 실행 및 테스트 
- graphql 연동 후 테스트



#### Node js 설치

- npm init
- npm install express --save



#### [graphQL](https://graphql.org/learn/)

- ```javascript
  npm install express express-graphql graphql --save
  ```



#### schema Object type, fields

```
type Character {
  name: String!
  appearsIn: [Episode!]!
}
```

- Character is GraphQL Object Type
- String : 서브 쿼리를 가질 수 없음
- String! : non-nullable Type
- [Episode!]! : non-nullable 



```javascript
type Starship {
  id: ID!
  name: String!
  length(unit: LengthUnit = METER): Float
}
```

- length : unit argument , default METER



#### 쿼리타입 & 뮤테이션 타입

```
schema {
  query: Query
  mutation: Mutation
}
```

- Mutation 타입의 필드를 정의하면 루트 뮤테이션으로 사용가능
- 모든 서비스 쿼리는 query 타입을 가지고 mutation 타입은 가질 수도 있고 가지지 않을 수도 있음
- GraphQL 서비스는 Query타입이 있어야 함

```
type Query {
  hero(episode: Episode): Character
  droid(id: ID!): Droid
} 
```

- Query 타입은 read 즉 HTTP 메소드로 get에 해당
- 나머지는 create, update, delete를 Mutation이 담당


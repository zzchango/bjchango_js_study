# GraphQL

[참고 URL](https://bricoler.tistory.com/2?category=778866)

### 개요

```javascript
type Query {
  me: User
}

type User {
  id: ID
  name: String
}
```

```javascript
function Query_me(request) {
  return request.auth.user;
}

function User_name(user) {
  return user.getName(); 
}
```

- 받은 쿼리는 이제 정의된 타입과 필드 여부 우선 확인
- 결과를 만들어내기 위해 제공된 함수 실행 



### 객체 참고를 위해 subSection 요청

```
{
  hero {
    name
    friends {
      name
    }
  }
}
```

```
{
  "data": {
    "hero": {
      "name": "R2-D2",
      "friends": [
        {
          "name": "Luke Skywalker"
        },
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        }]
    }
  }
}
```



### Arguments 요청

```
{
  human(id: "1000") {
    name
    height
  }
}
```

- REST 시스템에서는 오직 하나의 set of argument를 보낼 수 있음
- 각자 자신의 set of arguments 들을 가질 수 있어 멀티 API 요청을 가능하게 한다
- 또한 Enumeration type 사용이 가능



### Aliases

- 객체 필드와 쿼리필드 이름은 동일하지만 arguments는 동일하지 않아 쿼리를 보낼 수 없음
- 그렇기 때문에 aliases를 통해 전달가능하다

```
{
  empireHero: hero(episode: EMPIRE) {
    name
  }
  jediHero: hero(episode: JEDI) {
    name
  }
}
```

```
{
  "data": {
    "empireHero": {
      "name": "Luke Skywalker"
    },
    "jediHero": {
      "name": "R2-D2"
    }
  }
}
```

- Hero 필드는 충돌할 수 있지만 alias를 별칭을 통해 두 개의 결과를 모두 얻을 수 있음



### Fragments 

- 재사용 가능한 유닛을 쓰기 위해서는 frgment를 사용한다

```
{
  leftComparison: hero(episode: EMPIRE) {
    ...comparisonFields
  }
  rightComparison: hero(episode: JEDI) {
    ...comparisonFields
  }
}

fragment comparisonFields on Character {
  name
  appearsIn
  friends {
    name
  }
}
```

```
{
  "data": {
    "leftComparison": {
      "name": "Luke Skywalker",
      "appearsIn": [
        "NEWHOPE",
        "EMPIRE",
        "JEDI"
      ],
      "friends": [
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        },
        {
          "name": "C-3PO"
        },
        {
          "name": "R2-D2"
        }
      ]
    },
    "rightComparison": {
      "name": "R2-D2",
      "appearsIn": [
        "NEWHOPE",
        "EMPIRE",
        "JEDI"
      ],
      "friends": [
        {
          "name": "Luke Skywalker"
        },
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        }
      ]
    }
  }
}
```



### fragments에서 변수 사용



```
query HeroComparison($first: Int = 3) {
  leftComparison: hero(episode: EMPIRE) {
    ...comparisonFields
  }
  rightComparison: hero(episode: JEDI) {
    ...comparisonFields
  }
}

fragment comparisonFields on Character {
  name
  friendsConnection(first: $first) {
    totalCount
    edges {
      node {
        name
      }
    }
  }
}
```



### Operation name

```
query HeroNameAndFriends {
  hero {
    name
    friends {
      name
    }
  }
}
```

- opration type은 query, mutation, subscription 3개 중 하나
- type은 반드시 필요, 이를 생략하면 해당 작업에 이름과 변수를 부여할 수 없다.



### Variables

- 쿼리 문자열에 arguments 들을 적었으나 대부분 어플리켕이션에서 필드는 동적
- 동적 값을 쿼리에서 빼내어 variable로 보낼 수 있음
- 작업할 때 세가지가 필요 
  - 쿼리에 있는 동적인 값을 $variableName
  - $vairableName을 쿼리가 받는 변수 중 하나로 선언
  - variableName : value로 분리된 변수 집합으로 보낸다

> 예시

```
query HeroNameAndFriends($episode: Episode) {
  hero(episode: $episode) {
    name
    friends {
      name
    }
  }
}

{
  "episode": "JEDI"
}
```





### Default variables

```
query HeroNameAndFriends($episode: Episode = JEDI) {
  hero(episode: $episode) {
    name
    friends {
      name
    }
  }
}

```

- 모든 변수에 대해서 디폴트 값이 주어져 있으면 쿼리 변수 없이 요청할 수 있음



### Directives

- 한 가지 이상 조건이 필요할 때 조건을 통해 쿼리를 요청할 수 있음

```
query Hero($episode: Episode, $withFriends: Boolean!) {
  hero(episode: $episode) {
    name
    friends @include(if: $withFriends) {
      name
    }
  }
}

{
  "episode": "JEDI",
  "withFriends": false
}
```

- GraphQL 서버 구현에서 반드시 지원해야함
  - @include(if: Boolean) argument 가 true 일 때에만 이 필드를 포함한다.
  - @skip(if: Boolean) argument 가 true 면 이 필드를 스킵한다.



### Mutation

- 쓰는 행위에 대한 요청은 mutation을 통해 보내져야한다

```
mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
  createReview(episode: $ep, review: $review) {
    stars
    commentary
  }
}

{
  "ep": "JEDI",
  "review": {
    "stars": 5,
    "commentary": "This is a great movie!"
  }
}
```



```
{
  "data": {
    "createReview": {
      "stars": 5,
      "commentary": "This is a great movie!"
    }
  }
}
```

- mutation 은 query와 같이 여러 개의 필드를 포함할 수 있다
- query필드는 평행적으로 실행, mutation 필드는 하나씩 순서로 진행된다.
  - 두 번째 mutation은 반드시 첫 번째 mutation이 종료된 후 실행되며 경쟁하지 않는다



### Inline Fragments

- 공용체를 리턴할 필드 요청 시 데이터를 접근하기 위해서 inline fragments를 사용한다



```
query HeroForEpisode($ep: Episode!) {
  hero(episode: $ep) {
    name -> 둘다 가지고 있는 필드
    ... on Droid {
      primaryFunction
    }
    ... on Human {
      height
    }
  }
}
```



### MetaField

- 객체 타입 이름을 얻기위해 __typename이라는 메타 필드를 언제라도 요청할 수 있다.

```
{
  search(text: "an") {
    __typename
    ... on Human {
      name
    }
    ... on Droid {
      name
    }
    ... on Starship {
      name
    }
  }
}
```



## Schema



```
type Character {
  name: String!
  appearsIn: [Episode!]!
}
```

- `Character` 는 *GraphQL Object Type* 이다. 무슨 말이냐하면, 몇 개의 필드를 가진 타입이라는 뜻이다. 스키마의 부분의 타입은 object type 일 것이다.



### Query and Mutation type

Schema에서는 일반적인 object Type이지만 query와 mutation은 다르다

```
query {
  hero {
    name
  }
  droid(id: "2000") {
    name
  }
}
```

- GraphQL service 가 `droid`와 드로이드 필드를 가진 Query 타입이 있어야 한다는 것을 뜻한다.

```
type Query {
  hero(episode: Episode): Character
  droid(id: ID!): Droid
}
```



### Apollo Server



```graphql
# A book has a title and an author
type Book {
  title: String
  author: Author
}

# An author has a name and a list of books
type Author {
  name: String
  books: [Book]
}
```


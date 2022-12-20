# [QOAT (Quizzes Of All Time)](https://www.qoat.fr/)

![qoat](https://user-images.githubusercontent.com/104721818/208779918-0e20a101-006f-4510-8794-fb5e47433540.gif)

QOAT is on online platform for creating, passing and discussing online quizzes. The platform allows for collaborative correction of quizzes. This is a fullstack personal project (wireframed, designed & developped by myself) that has been used in a real environment.

## Features

- Creating a quiz
- Search quizzes (by name/category)
- Attempts history and statistics
- Filter questions by type during an attempt & on statistics
- Discussion forum for each quiz
- Possibility for collaborative correction of questions
- KaTeX support

## Technologies used

- Typescript
- Nextjs
- Redux & RTK query
- TailwindCSS & HeadlessUI
- Firebase (auth, database, cloud functions)
- Algolia

## Main challenges

Among other things, implementing an auth process that's as frictionless as possible from an UX standpoint required a lot of prototyping & incremental upgrades. This was also my first time with Algolia and building a custom UI for it's instant search API had me spend quite a lot of time in the docs.

<img width="960" alt="Capture d’écran 2022-12-12 162648" src="https://user-images.githubusercontent.com/104721818/207087119-26b6fed9-e324-46c8-a9f4-fa841f92afbe.png">
<img width="947" alt="Capture d’écran 2022-12-11 185220" src="https://user-images.githubusercontent.com/104721818/207087075-87b11d12-0470-47b8-aea9-18638e105091.png">

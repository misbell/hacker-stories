import React from "react"

const welcome = {
  greeting: "Working",
  title: "Example",
}

function getTitle(title) {
  return title
}

// short version
// const getAsyncStories = () =>
//   Promise.resolve({ data: { stories: initialStories } });

// long version
// const getAsyncStories = () =>
//   new Promise(resolve =>
//     resolve({ data: { stories: initialStories } })
//   );

// artificial delay for demo of async

// causes an error
// const getAsyncStories = () =>
//   new Promise((resolve, reject) => setTimeout(reject, 2000));

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState,
  )

  React.useEffect(() => {
    localStorage.setItem(key, value)
  }, [value])


  return [value, setValue]
}

const storiesReducer = (state, action) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      }
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      }
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      }
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID,
        ),
      }
    default:
      throw new Error()
  }
}
const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query="

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React")

  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );

  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };


  // const [stories, setStories] = React.useState([]);

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  })

  //React.useEffect(() => {

  const handleFetchStories = React.useCallback(() => {
    if (!searchTerm) return

    dispatchStories({ type: "STORIES_FETCH_INIT" })


    fetch(`${API_ENDPOINT}${searchTerm}`) // B
      .then((response) => response.json()) // C
      .then((result) => {

        dispatchStories({
          type: "STORIES_FETCH_SUCCESS",
          payload: result.hits, //D
        })
      })
      .catch(() =>
        dispatchStories({

          type: "STORIES_FETCH_FAILURE",
        }),
      )
  }, [searchTerm])


  React.useEffect(() => {
    handleFetchStories()
  }, [handleFetchStories])

  // React.useEffect(() => {
  //   dispatchStories({ type: 'STORIES_FETCH_INIT' });

  //   fetch(`${API_ENDPOINT}react`) // B
  //     .then(response => response.json()) // C
  //     .then(result => {
  //       dispatchStories({
  //         type: 'STORIES_FETCH_SUCCESS',
  //         payload: result.hits, // D
  //       });
  //     })
  //     .catch(() =>
  //       dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
  //     );
  // }, []);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    })
  }

  React.useEffect(() => {
    localStorage.setItem("search", searchTerm)
  }, [searchTerm])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  // note this still runs on render
  // even if not called anywhere
  // const searchedStories = stories.data.filter(function (story) {

  //   return story.title
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase());

  // });

  // block syntax not concise syntax
  // because code before the return

  return (
    <div>
      <h1>
        {welcome.greeting} {welcome.title}
      </h1>

      <h1>{getTitle("Interactive Search")}</h1>

      <InputWithLabel
        id="search"
        label="Search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearchInput}
      >
        <strong>Search:</strong>
      </InputWithLabel>


    </div>
  )
}

const InputWithLabel = ({
  id,
  label,
  value,
  type = "text",
  onInputChange,
  isFocused,
  children,
}) => {
  // imperative code

  const inputRef = React.useRef()

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused])

  // imperative code ends

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        autoFocus={isFocused}
        onChange={onInputChange}
      />
    </>
  )
}

const Search = ({ search, onSearch }) => {
  return (
    <>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" value={search} onChange={onSearch} />
    </>
  )
}

// MPI a react component
// and a leaf component
// since it doesn't render any other components.
// concise syntax

// versions of List and Item MPI
// const List = ({ list }) =>
//   list.map(({ objectID, ...item }) => // ... here is 'rest of' operator
//     <Item key={item.objectID}
//       {...item} //... here is spread operator
//     />);

// const List = ({ list }) =>
//   list.map(item =>
//     <Item key={item.objectID}
//       title={item.title}
//       url={item.url}
//       author={item.author}
//       num_comments={item.num_comments}
//       points={item.points}
//     />);

// const Item = ({ title, url, author, num_comments, points }) => (
//   <div>
//     <span>
//       <a href={url}>{title}</a>
//     </span>
//     <span>{author}</span>
//     <span>{num_comments}</span>
//     <span>{points}</span>
//   </div>
// )

const List = ({ list, onRemoveItem }) =>
  list.map((item) => (
    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
  ))

const Item = ({ item, onRemoveItem }) => {
  // const handleRemoveItem = () => {
  //   onRemoveItem(item);
  // };
  function handleRemoveItem() {
    onRemoveItem(item) // MPI same thing
  }

  return (
    <div>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        {/* <button type="button" onClick={handleRemoveItem}> */}
        {/* <button type="button" onClick={onRemoveItem.bind(null, item)}> */}
        <button
          type="button"
          onClick={() => {
            onRemoveItem(item)
          }}
        >
          {/* all three lines end up doing same thing MPI */}
          Dismiss
        </button>
      </span>
    </div>
  )
}

export default App

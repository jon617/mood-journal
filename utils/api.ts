const createURL = path => {
  return window.location.origin + path; 
}

export const createNewEntry = async () => {
  const res = await fetch(
    new Request(createURL("/api/journal"), {
      method: "POST",
    })
  );
  if (res.ok) {
    const data = await res.json();
    return data.data;
  }
}

export const deleteAll = async () => {
  const res = await fetch(
    new Request( `${window.location.origin}/api/journal`, {
      method: "DELETE",
    })
  );
  if (res.ok) {
    const data = await res.json();
    return data.data;
  }
}

export const updateEntry = async (id, content) => {
  const res = await fetch(
    new Request(
      createURL(`/api/journal/${id}`),
      {
        method: "PATCH",
        body: JSON.stringify({ content }),
      }
    )
  );
  if (res.ok) {
    const data = await res.json();
    return data.data;
  } else {
    // got 4xx or 5xx
  }

  // .. when error, return something like { error: "code" }
}

export const askQuestion = async (question) => {
  const res = await fetch(
    new Request(createURL("/api/question"), {
      method: "POST",
      body: JSON.stringify({ question }),
    })
  );
  if (res.ok) {
    const data = await res.json();
    return data.data;
  }
}
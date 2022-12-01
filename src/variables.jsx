import { useSelector } from "react-redux";

export const URL = "http://localhost:8000/"
export const THIS_URL = "http://localhost:3000/"

// export const URL = "https://bmtestapi.enterscience.com.br/"
// export const THIS_URL = "https://bmtest.enterscience.com.br/"

export const API_URL = URL + "api/";
export const STORAGE_URL = URL + "storage/";

export function MOUNT_FORM_DATA(props) {
  let data = new FormData()
  let array = [...props.form]

  array.forEach(item => {
    let obj = { ...item }
    let keys = Object.keys(obj)

    keys.forEach(item2 => {
      data.append(`${item2}`, obj[item2].value)
    })
  })

  if (props.id) data.append('id', props.id)
  return data
}

export function MOUNT_JSON_BODY(props) {
  let body = {}
  let keys = { ...props.form }

  keys = Object.keys(keys)
  keys.forEach(item => {
    body = { ...body, [item]: props.form[item].value }
  })

  if (props.id) body = { ...body, id: props.id }
  return body
}

export async function POST_FETCH_FORMDATA(props) {
  return (fetch(props.url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${props.token}`
    },
    body: props.body
  }).then(async (response) => {
    const resp = await response.json()
    return resp
  })
  )
}

export async function POST_FETCH(props) {
  return (fetch(props.url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${props.token}`
    },
    body: JSON.stringify({ ...props.body })
  }).then(async (response) => {
    const resp = await response.json()
    return resp
  })
  )
}

export async function PUT_FETCH(props) {
  return (fetch(`${URL}api/${props.url}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${props.token}`
    },
    body: JSON.stringify({ ...props.body })
  }).then(async (response) => {
    const resp = await response.json()
    return resp
  })
  )
}

export async function PATCH_FETCH_FORMDATA(props) {
  return (fetch(`${URL}api/${props.url}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${props.token}`
    },
    body: props.body
  }).then(async (response) => {
    const resp = await response.json()
    return resp
  })
  )
}

export async function PATCH_FETCH(props) {
  return (fetch(props.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${props.token}`
    },
    body: JSON.stringify({ ...props.body })
  }).then(async (response) => {
    const resp = await response.json()
    return resp
  })
  )
}

export async function POST_PUBLIC_FETCH(props) {
  console.log('props', props.body)
  return (fetch(props.url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...props.body })
  }).then(async (response) => {
    const resp = await response.json()
    return resp
  })
  )
}

export async function GET_FETCH(props) {
  return (fetch(`${URL}api/${props.url}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${props.token}`
    }
  }).then(async (response) => {
    const resp = await response.json()
    return resp
  })
  )
}

export async function GET_PUBLIC_FETCH(props) {
  return (fetch(props.url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  }).then(async (response) => {
    const resp = await response.json()
    return resp
  })
  )
}

export function SEED_STATE(props) {
  if (props.state) {
    let state2 = { ...props.state }
    let keys = Object.keys({ ...props.state })
    keys.forEach(item => {
      if (state2[item].value !== undefined) state2[item].value = props.respState[item]
      if (state2[item].mask !== undefined) state2[item].mask = props.respState[item]
      if (state2[item].url !== undefined) state2[item].url = props.respState[item]

      if (state2[item].type === 'date') {
        let array = Array.from(props.respState[item])
        const date = array.splice(0, 10).toString().replace(/,/g, "")
        console.log('date', date)
        state2[item].value = date
      }
    })

    if (props.setId) props.setId(props.respState.id)
    props.setState(state2)
    return true
  } else {
    return false
  }
}
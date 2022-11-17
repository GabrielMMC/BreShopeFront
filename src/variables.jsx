import { useSelector } from "react-redux";

export const URL = "http://localhost:8000/"
export const THIS_URL = "http://localhost:3000/"

// export const URL = "https://bmtestapi.enterscience.com.br/"
// export const THIS_URL = "https://bmtest.enterscience.com.br/"

export const API_URL = URL + "api/";
export const STORAGE_URL = URL + "storage/";

export function MOUNT_FORM_DATA(props) {
  let data = new FormData()
  let keys = { ...props.form }
  keys = Object.keys(keys)
  keys.forEach(item => {
    data.append(`${item}`, props.form[item].value)
  })
  return data
}

export function MOUNT_JSON_BODY(props) {
  let body = {}
  let keys = { ...props.form }
  keys = Object.keys(keys)
  keys.forEach(item => {
    body = { ...body, [item]: props.form[item].value }
  })
  return body
}

export async function POST_FETCH(props) {
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
  return (fetch(props.url, {
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
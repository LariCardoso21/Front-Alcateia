const API_URL = 'http://localhost:5191/api'

export async function apiFetch(endpoint, method = 'GET', data = null) {

    const config = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    }

    if (data) {
        config.body = JSON.stringify(data)
    }

   const response = await fetch(`${API_URL}${endpoint}`, config)

    return response.json()
}
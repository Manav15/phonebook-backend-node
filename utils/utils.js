const generateId = (data) => {
    let id = 1
    let minId = Math.max(...data.map((item) => item.id))
    while (id < minId) {
        id = Math.floor(Math.random() * 500)
    }
    return id
}

module.exports = generateId;
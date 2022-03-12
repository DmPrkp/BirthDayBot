function newEntityCreator(entity, val) {
    for (const key of Object.keys(val)) {
        (key === 'id') ? entity.telegramId = val[key] : entity[key] = val[key];
    }
    return entity
}

export default newEntityCreator
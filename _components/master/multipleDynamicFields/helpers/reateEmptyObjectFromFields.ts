const createEmptyObjectFromFields = (fields) : any => {
    return Object.keys(fields).reduce(
      (obj, key) => ({ ...obj, [key]: null }),
      {}
    );
};

export default createEmptyObjectFromFields;
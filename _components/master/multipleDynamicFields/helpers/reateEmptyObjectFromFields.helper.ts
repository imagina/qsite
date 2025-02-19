const createEmptyObjectFromFields = (fields) : any => {
    let objectFields = Array.isArray(fields) ? fields : {...fields};
    if(Array.isArray(fields)) {
      objectFields = fields.reduce((obj, item) => {
        if (item.props && item.props.label) {
          obj[item.props.label] = item;
        }
        return obj;
      }, {});
    }
    return Object.keys(objectFields).reduce(
      (obj, key) => ({ ...obj, [key]: null }),
      {}
    );
};

export default createEmptyObjectFromFields;

function useField(config: Screen) {
    const fields = config.fields.map((field) => {
        // logic to map config field to form field component
        return [field.field_id, field];
    });

    function computeNextScreen(data) {}

    return {
        fields: Object.fromEntries(fields),
        nextScreenId: (data) => computeNextScreen(data),
    };
}

export default useField;

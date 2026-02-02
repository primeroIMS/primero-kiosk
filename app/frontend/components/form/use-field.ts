function useField(config: Screen) {
    const fields = Object.fromEntries(
        config.fields.map((field) => {
            // logic to map config field to form field component
            return [field.field_id, field];
        }),
    );

    function computeNextScreen(data) {}

    function computeScope(scope) {
        if (scope === "records") {
            return "records.0";
        }

        return scope;
    }

    function buildName(id: string) {
        const field = fields[id];
        if (!field) {
            throw new Error(`Field with id ${id} not found`);
        }
        return `${computeScope(field.scope)}.${field.backend_id}`;
    }

    return {
        buildName,
        fields,
        nextScreenId: (data) => computeNextScreen(data),
    };
}

export default useField;

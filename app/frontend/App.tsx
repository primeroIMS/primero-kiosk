import "./app.css";
import useI18n from "./hooks/use-i18n";

const App = () => {
    const i18n = useI18n();

    return (
        <>
            <h1 className="text-3xl font-bold underline">App Component</h1>
            <h1 className="text-xl font-bold underline">{i18n.t("hello")}</h1>
        </>
    );
};

export default App;

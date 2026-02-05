import Button from "@/components/Button";
import i18n from "@/translations";
import { Screen } from "@/type";
import PageTitle from "@/components/PageTitle";

type Props = {
  config: Screen;
};

function CharacterResponse({ config }: Props) {
  return (
    <>
      <div className="mb-10 bg-white p-5 rounded-lg">
        <h1 className="text-foreground text-center font-bold mb-5">{config.title.text[i18n.locale]}</h1>
        <p className="text-foreground text-center whitespace-pre-line">
          {config.description?.text?.[i18n.locale]}
        </p>
      </div>
      <div className="mb-20">
        {config.featured_image && (
          <img
            alt="Featured Image"
            className="mb-8 object-cover"
            width={150}
            src={config.featured_image}
          />
        )}
      </div>
      <div className="flex justify-between">
        <Button
          text="buttons.back"
          variant="outline"
          className="bg-transparent border-2 text-white pr-10 pl-10"
        />
        <Button
          text="buttons.next"
          type="button"
          variant="secondary"
          className="pr-10 pl-10"
        />
      </div>
    </>
  );
}

export default CharacterResponse;

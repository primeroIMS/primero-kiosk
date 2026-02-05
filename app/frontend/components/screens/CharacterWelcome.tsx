import Button from "@/components/Button";
import i18n from "@/translations";
import { Screen } from "@/type";
import PageTitle from "@/components/PageTitle";

type Props = {
  config: Screen;
};

function CharacterWelcome({ config }: Props) {
  return (
    <>
      <div className="mb-5 bg-cyan-500 p-5 rounded-lg pr-30">
        <div className="mb-5 bg-white p-5 rounded-lg">
          <h1 className="text-foreground text-left font-bold mb-5 text-2xl" style={{ color: config?.title?.color }}>
            {config.title.text[i18n.locale]}
          </h1>
          <p className="text-foreground text-left whitespace-pre-line text-lg" style={{ color: config?.description?.color }}>
            {config.description?.text?.[i18n.locale]}
          </p>
        </div>
        <div className="mb-20">
          {config.featured_image && (
            <img
              alt="Featured Image"
              className="mb-8 object-cover rounded-full"
              width={150}
              src={config.featured_image}
            />
          )}
        </div>
      </div>
      <div className="flex justify-end ml-5">
        <Button
          text="buttons.continue"
          variant="secondary"
          className="pr-10 pl-10"
        />
      </div>
    </>
  );
}

export default CharacterWelcome;

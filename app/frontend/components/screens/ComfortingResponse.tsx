import Button from "@/components/Button";
import i18n from "@/translations";
import { Screen } from "@/type";
import PageTitle from "@/components/PageTitle";

type Props = {
  config: Screen;
};

function ComfortingResponse({ config }: Props) {
  return (
    <>
      {config.featured_image && (
        <img
          alt="Featured Image"
          className="mb-8"
          src={config.featured_image}
        />
      )}
      {config.title.text?.[i18n.locale] && (
        <PageTitle color={config.title.color}>
          {config.title.text[i18n.locale]}
        </PageTitle>
      )}
      {config.description?.text?.[i18n.locale] && (
        <p className="text-foreground text-center text-lg whitespace-pre-line" style={{ color: config?.description?.color }}>
          {config.description.text[i18n.locale]}
        </p>
      )}
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

export default ComfortingResponse;

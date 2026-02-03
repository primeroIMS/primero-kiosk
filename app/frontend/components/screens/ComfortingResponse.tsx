import { useNavigate, useRouter } from "@tanstack/react-router";

import Button from "@/components/Button";
import i18n from "@/translations";
import { Screen } from "@/type";
import PageTitle from "@/components/PageTitle";

type Props = {
  config: Screen;
};

function ComfortingResponse({ config }: Props) {
  const router = useRouter();
  const navigate = useNavigate();

  return (
    <>
      {config.featured_image && (
        <img
          alt="Featured Image"
          className="mb-8"
          src={config.featured_image}
        />
      )}
      {config.title.text_i18n?.[i18n.locale] && (
        <PageTitle color={config.title.color}>
          {config.title.text_i18n[i18n.locale]}
        </PageTitle>
      )}
      {config.description?.text_i18n?.[i18n.locale] && (
        <p className="text-foreground text-center text-lg whitespace-pre-line" style={{ color: config?.description?.color }}>
          {config.description.text_i18n[i18n.locale]}
        </p>
      )}
      <Button
        text="buttons.back"
        onClick={() => router.history.back()}
        variant="outline"
      />
      <Button
        text="buttons.next"
        type="button"
        onClick={() => navigate({ to: `/screens/${config.flow.next_screen?.default}` })}
        variant="secondary"
      />
    </>
  );
}

export default ComfortingResponse;

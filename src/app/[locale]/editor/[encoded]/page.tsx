import { EditorScreen } from "@/components/editor/EditorScreen";

export default async function SharedEditorPage({
  params,
}: {
  params: Promise<{ locale: string; encoded: string }>;
}) {
  const { encoded } = await params;

  return <EditorScreen encoded={encoded} />;
}

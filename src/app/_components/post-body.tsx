import markdownStyles from "./markdown-styles.module.css";

type Props = {
  content: string;
};

export function PostBody({ content }: Props) {
  const formatInstructions = (instructions: string) => {
    return instructions.split(/(?=\d+\.\s)/).map((instruction, index) => (
      <p key={index} className="mb-4">{instruction.trim()}</p>
    ));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className={markdownStyles["markdown"]}>
        {formatInstructions(content)}
      </div>
    </div>
  );
}

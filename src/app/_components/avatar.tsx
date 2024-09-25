type Props = {
  author: string;
};

const Avatar = ({ author }: Props) => {
  return (
    <div className="flex items-center">
      <div className="text-xl font-bold">{author}</div>
    </div>
  );
};

export default Avatar;

type Props = {
  author: string;
};

const Avatar = ({ author }: Props) => {
  return (
    <div>
      <div className="text-xl text-center">{author}</div>
    </div>
  );
};

export default Avatar;

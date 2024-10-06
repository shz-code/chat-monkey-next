interface PageProps {
  params: {
    chatId: string;
  };
}

const page = async ({ params }: PageProps) => {
  console.log(params.chatId);

  return <div>page</div>;
};

export default page;

import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import { Intro } from "@/app/_components/intro";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllPosts } from "@/lib/api";
import { getServerSession } from "next-auth";


export default async function Home() {
  const session = await getServerSession();

  const allPosts = getAllPosts();

  const heroPost = allPosts[0];

  const morePosts = allPosts.slice(1);

  return (
    <main>
      getServerSession Result
      {session?.user?.name ? (
        <><div>{session?.user?.name}</div><Container>
          <Intro />
          <HeroPost
            title={heroPost.title}
            coverImage={heroPost.coverImage}
            date={heroPost.date}
            author={heroPost.author}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt} />
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container></>) : (<div>Not logged in</div>)}
    </main>
  );
}

import NewTweetForm from "~/components/NewTweetForm";
import { api } from "~/utils/api";
import InfiniteTweetsList from "~/components/InfiniteTweetsList"
import { useSession } from "next-auth/react";
import { NextPage } from "next";
import { useState } from "react";

const Tabs = ["Explore", "Following"] as const

 const Home: NextPage = ()=> {
  const [selectedTab, setSelectedTab] = useState<(typeof Tabs)[number]>("Explore");
  const session = useSession();

  return (
    <>
    <header className="sticky top-0 z-10 border-b bg-white pt-2">
      <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
      {session.status === "authenticated" && (
        <div className="flex">
          {Tabs.map(tab =>{
          return (
          <button
           key={tab} 
           className={`flex-grow p-2 hover:bg-gray-200 focus-visible-bg-gray-200
            ${tab === selectedTab ? "border-b-4 border-b-blue-500 font-bold"
            : ""}`}
            onClick={()=>setSelectedTab(tab)}
        >{tab}</button>
        );
        })}
       </div>
      )}
    </header>
    <NewTweetForm />
    {selectedTab === "Explore" ? <RecentTweets /> : <FollowingTweets />}
    
    </>
  );
  };
  function RecentTweets(){
    const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
      {},
      {getNextPageParam:(lastPage)=>lastPage.nextCursor}
      );
      console.log(tweets.data?.pages.flatMap(e => e.tweets))
    return (
    <InfiniteTweetsList 
    tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
    isError={tweets.isError}
    isLoading={tweets.isLoading}
    hasMore={tweets.hasNextPage ? true : false}
    fetchNewTweets={tweets.fetchNextPage}
    />)
  }
  function FollowingTweets(){
    const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
      {onlyFollowing:true},
      {getNextPageParam:(lastPage)=>lastPage.nextCursor}
      );
      console.log(tweets.data?.pages.flatMap(e => e.tweets))
    return (
    <InfiniteTweetsList 
    tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
    isError={tweets.isError}
    isLoading={tweets.isLoading}
    hasMore={tweets.hasNextPage ? true : false}
    fetchNewTweets={tweets.fetchNextPage}
    />)
  }

  export default Home;
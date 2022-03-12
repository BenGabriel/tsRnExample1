import { StatusBar } from "expo-status-bar";
import { FC, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { post } from "./data/types";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { posts, Users } from "./data";
import { TextInput } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("screen");

const val = new Animated.Value(0);
const bottomVal = new Animated.Value(0);

const currentUser = {
  id: 1,
  name: "Ben",
  avatar:
    "https://cdn4.vectorstock.com/i/thumb-large/78/38/avatar-men-design-vector-14527838.jpg"
};

const PopularPost: FC<post> = (props) => (
  <View style={styles.popularPost}>
    <Text>{props.text}</Text>
    <View
      style={{
        width: "100%",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingHorizontal: 10
      }}
    >
      <TouchableOpacity>
        <FontAwesome name="heart-o" color="#555" size={18} />
      </TouchableOpacity>
    </View>
  </View>
);

const Post: FC<post> = (props) => {
  const isAlreadyLiked = (): boolean =>
    props.likes.includes(currentUser.id) ? true : false;
  return (
    <View style={styles.post}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: "rgba(200,200,200,0.3)",
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {props.authorDetails?.name.charAt(0)}
          </Text>
        </View>
        <Text style={{ fontWeight: "600" }}>{props.authorDetails?.name}</Text>
      </View>
      <View
        style={{
          flex: 3,
          justifyContent: "center"
        }}
      >
        <Text>{props.text}</Text>
      </View>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 10,
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 40,
            alignItems: "center"
          }}
          onPress={props.likePost}
        >
          <Text>{props.likes.length}</Text>
          <FontAwesome
            name={isAlreadyLiked() ? "heart" : "heart-o"}
            color="#555"
            size={22}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 40,
            alignItems: "center"
          }}
          onPress={props.makeComment}
        >
          <Text>{props.comments.length}</Text>
          <FontAwesome name="comment-o" color="#555" size={22} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const App: FC = () => {
  const [allPosts, setAllPosts] = useState<any[]>(posts);
  const [trendingPosts, setTrendingPosts] = useState<post[]>([]);

  const [commentModalVisible, setCommentModalVisible] =
    useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<post | null>(null);
  const [currentText, setCurrentText] = useState<string>("");

  const getTrendingPosts = () => {
    const posts: post[] = allPosts.sort((a: post, b: post) => {
      return a.likes > b.likes ? 1 : b.likes > a.likes ? -1 : 0;
    });

    const trend = posts.slice(0, 4);
    setTrendingPosts(trend);
  };

  const getAuthorDetails = () => {
    const __posts = posts.map((post) => {
      const authorDetails = Users.find((author) => author.id == post.author);
      return { ...post, authorDetails };
    });
    setAllPosts(__posts);
  };

  const animateValues = () =>
    Animated.timing(val, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false
    }).start();

  const animateBottomVal = (_val: number) =>
    Animated.timing(bottomVal, {
      toValue: _val,
      duration: 600,
      useNativeDriver: true
    }).start();

  const bottomTabInterpolate = bottomVal.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200]
  });

  const bottomStyle = {
    transform: [
      {
        translateY: bottomTabInterpolate
      }
    ]
  };

  useEffect(() => {
    animateValues();
    getTrendingPosts();
    getAuthorDetails();
  }, []);

  const likePost = (id: number): number => {
    //add current user id to the likes array of the post

    // find the post of the current id
    const currentPosts = allPosts.find((post: post) => post.id == id);

    //get the likes arrary of the current post
    const likes = currentPosts?.likes;

    //check if current user id is already in the post
    const alreadyLiked = likes?.includes(id);

    // add current user id to the likes array
    const __likes = alreadyLiked
      ? likes?.filter((like: number) => like !== id)
      : likes
      ? [...likes, currentUser.id]
      : [currentUser.id];
    // const __likes = likes ? [...likes, id] : [id];

    //update the likes of the current post
    const updatedPost = { ...currentPosts, likes: __likes };

    //replace the current post in all post
    const updatedPosts = allPosts.map((post: post) =>
      post.id == id ? updatedPost : post
    );

    setAllPosts(updatedPosts);

    return id;
  };

  const makeComment = (id: number) => {
    //save the is as current post
    const currentPost = allPosts.find((post: post) => post.id == id);
    setCurrentPost(currentPost);
    //enable comment Modal
    setCommentModalVisible(true);
  };

  const postComment = () => {
    //current post id
    const id = currentPost?.id;

    //current comment text
    const text = currentText;

    // comment object,
    const comment = {
      id: Date.now(),
      timeStamp: Date.now(),
      text,
      author: currentUser
    };

    const updatedPost = {
      ...currentPost,
      comments: currentPost?.comments
        ? [...currentPost?.comments, comment]
        : [comment]
    };

    setCurrentPost(updatedPost);

    //update the current post in all posts

    const updatedPosts = posts.map((post: post) =>
      post.id == id ? updatedPost : post
    );
    setAllPosts(updatedPosts);
  };

  const coverInterpolate = val.interpolate({
    inputRange: [0, 1],
    outputRange: [9, 1]
  });

  const imageInterpolate = val.interpolate({
    inputRange: [0, 1],
    outputRange: ["200%", "100%"]
  });

  const mainInterpolate = val.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  const dynamicFlex = {
    flex: coverInterpolate
  };
  const dynamicImage = {
    height: imageInterpolate
  };

  const dynamicMain = {
    opacity: mainInterpolate
  };

  return (
    <View style={styles.container}>
      <Animated.View style={dynamicFlex}>
        <Animated.Image
          source={{
            uri: "https://wallsdesk.com/wp-content/uploads/2017/01/Tel-Aviv-Photos.jpg"
          }}
          width={width}
          height={200}
          style={{ ...styles.coverImage, ...dynamicImage }}
        />
      </Animated.View>
      <Animated.View style={[styles.main, dynamicMain]}>
        <View style={styles.popular}>
          <FlatList
            data={trendingPosts}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <PopularPost
                id={item.id}
                author={item.author}
                comments={item.comments}
                likes={item.likes}
                text={item.text}
                timeStamp={item.timeStamp}
                authorDetails={item.authorDetails}
                likePost={() => likePost(item.id)}
              />
            )}
          />
        </View>
        <View style={{ flex: 3, marginTop: -50 }}>
          <FlatList
            data={allPosts}
            onScrollBeginDrag={(e: any) => animateBottomVal(1)}
            onScrollEndDrag={(e: any) => animateBottomVal(0)}
            ListHeaderComponent={() => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly"
                }}
              >
                <TouchableOpacity style={styles.btn}>
                  <Text style={{ color: "#fff" }}>NEWS</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn}>
                  <Text style={{ color: "#fff" }}>IMAGES</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn}>
                  <Text style={{ color: "#fff" }}>VIDEOS</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn}>
                  <Text style={{ color: "#fff" }}>POLLS</Text>
                </TouchableOpacity>
              </View>
            )}
            renderItem={({ item }) => (
              <Post
                id={item.id}
                author={item.author}
                comments={item.comments}
                likes={item.likes}
                text={item.text}
                timeStamp={item.timeStamp}
                authorDetails={item.authorDetails}
                likePost={() => likePost(item.id)}
                makeComment={() => makeComment(item.id)}
              />
            )}
          />
        </View>
      </Animated.View>
      <Animated.View style={[styles.bottomTab, bottomStyle]}>
        <TouchableOpacity style={styles.bottomTabBtn}>
          <FontAwesome name="home" size={15} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTabBtn}>
          <FontAwesome name="search" size={15} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTabBtn}>
          <FontAwesome name="plus" size={15} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTabBtn}>
          <FontAwesome name="bell" size={15} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTabBtn}>
          <FontAwesome name="user" size={15} color="white" />
        </TouchableOpacity>
      </Animated.View>
      <Modal visible={commentModalVisible} animationType="slide">
        <SafeAreaView />
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: width / 1.1,
              alignSelf: "center",
              marginVertical: 10
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setCommentModalVisible(false);
                setTimeout(() => {
                  setCurrentPost(null);
                }, 500);
              }}
            >
              <FontAwesome name="angle-left" size={22} />
            </TouchableOpacity>
          </View>
          {currentPost && (
            <Post
              id={currentPost.id}
              author={currentPost.author}
              comments={currentPost.comments}
              likes={currentPost.likes}
              text={currentPost.text}
              timeStamp={currentPost.timeStamp}
              authorDetails={currentPost.authorDetails}
              likePost={() => likePost(currentPost.id)}
            />
          )}
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.select({ ios: 40, android: 20 })}
            behavior={Platform.select({ ios: "padding", android: undefined })}
          >
            <View style={{ flex: 7 }}>
              {currentPost?.comments && (
                <FlatList
                  data={currentPost.comments}
                  renderItem={({ item, index }) => (
                    <View
                      style={{
                        width: width / 1.05,
                        alignSelf: "center",
                        marginVertical: 10,
                        backgroundColor: "#fff",
                        elevation: 2,
                        padding: 10,
                        borderRadius: 20
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          paddingHorizontal: 10,
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <View
                            style={{
                              width: 30,
                              height: 30,
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "#ddd",
                              borderRadius: 50
                            }}
                          >
                            <Text>{item.author?.name.charAt(0)}</Text>
                          </View>
                          <Text
                            style={{ paddingHorizontal: 5, fontWeight: "600" }}
                          >
                            {item.author?.name}
                          </Text>
                        </View>
                        <View>
                          <Text
                            style={{ paddingHorizontal: 5, fontWeight: "600" }}
                          >
                            {/* {moment(item.timeStamp).fromNow()} */}
                            {item.timeStamp}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <Text style={{ width: "75%", alignSelf: "center" }}>
                          {item.text}
                        </Text>
                      </View>
                    </View>
                  )}
                />
              )}
            </View>
            <View
              style={{
                flex: 3,
                justifyContent: "flex-end",
                paddingBottom: 30,
                alignItems: "center"
              }}
            >
              <View
                style={{
                  ...styles.input,
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  maxHeight: 50,
                  alignContent: "center",
                  position: "relative"
                }}
              >
                <TextInput
                  style={{ flex: 1, padding: 5 }}
                  placeholder="write yout comment here...."
                  onChangeText={(text: string) => setCurrentText(text)}
                />
                <TouchableOpacity onPress={postComment}>
                  <MaterialCommunityIcons
                    name="send"
                    color="rgba(81, 135, 200, 1)"
                    size={24}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
};

export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  main: {
    flex: 3,
    backgroundColor: "#f1f1f1"
  },
  coverImage: {
    width: width,
    height: "100%"
  },
  popular: {
    flex: 1,
    justifyContent: "center",
    marginTop: -50
  },
  popularPost: {
    backgroundColor: "#fff",
    width: width / 2.5,
    height: width / 4,
    marginHorizontal: 10,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5
  },
  post: {
    backgroundColor: "white",
    width: width / 1.05,
    alignSelf: "center",
    minHeight: height / 4,
    elevation: 2,
    marginVertical: 5,
    padding: 10
  },
  btn: {
    backgroundColor: "rgba(81, 135, 200, 1)",
    padding: 10,
    borderRadius: 5,
    width: width / 4.5,
    alignItems: "center",
    justifyContent: "center"
  },
  bottomTabBtn: {
    backgroundColor: "rgba(200, 200, 200, 0.5)",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10
  },
  bottomTab: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 15,
    backgroundColor: "white"
  },
  input: {
    width: width / 1.1,
    backgroundColor: "#fff",
    padding: 10,
    elevation: 2,
    borderRadius: 20
  }
});

import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const PromptCard = ({ post, handleEdit, handleDelete, handleTagClick, isProfilePage }) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();
  const [copied, setCopied] = useState("");
  const [showFullPrompt, setShowFullPrompt] = useState(false);

  const handleProfileClick = () => {
    if (post.creator._id === session?.user.id) {
      router.push("/profile");
    } else {
      router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
    }
  };

  const handleCopy = () => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(false), 3000);
  };

  const openFullPrompt = () => {
    setShowFullPrompt(true);
  };

  const closeFullPrompt = () => {
    setShowFullPrompt(false);
  };

  const truncatePrompt = (text, limit) => {
    if (text.length <= limit) return text;
    const lastSpaceIndex = text.lastIndexOf(" ", limit);
    return text.substring(0, lastSpaceIndex) + " ...";
  };

  const promptCardHeight = isProfilePage ? '250px' : '200px'; // Adjust height based on profile page or not

  return (
    <>
      <div className='prompt_card' style={{ height: promptCardHeight, overflow: 'hidden' }}>
        <div className='flex justify-between items-start gap-5'>
          <div
            className='flex-1 flex justify-start items-center gap-3 cursor-pointer'
            onClick={handleProfileClick}
          >
            <Image
              src={post.creator.image}
              alt='user_image'
              width={40}
              height={40}
              className='rounded-full object-contain'
            />

            <div className='flex flex-col'>
              <h3 className='font-satoshi font-semibold text-gray-900'>
                {post.creator.username}
              </h3>
              <p className='font-inter text-sm text-gray-900'>
                {post.creator.email}
              </p>
            </div>
          </div>

          <div className='copy_btn' onClick={handleCopy} style={{ backgroundColor : "#1F1A2D" }} >
            <Image
              src={
                copied === post.prompt
                  ? "/assets/icons/tick.svg"
                  : "/assets/icons/copy.svg"
              }
              alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
              width={12}
              height={12}
            />
          </div>
        </div>

        <div className='prompt_content'>
          <p className='font-satoshi text-sm prompt_para'>
            {truncatePrompt(post.prompt, 100)}
            {post.prompt.length > 100 && (
              <span className='expand_link' onClick={openFullPrompt}>
                {showFullPrompt ? 'Read Less' : 'Read More >>'}
              </span>
            )}
          </p>
        </div>

        <p
          className='font-inter text-sm blue_gradient cursor-pointer'
          onClick={() => handleTagClick && handleTagClick(post.tag)}
        >
          #{post.tag}
        </p>

        {session?.user.id === post.creator._id && pathName === "/profile" && (
          <div className='mt-5 flex-center gap-4 border-t border-gray-100 pt-3'>
            <p
              className='font-inter text-sm green_gradient cursor-pointer'
              onClick={handleEdit}
            >
              Edit
            </p>
            <p
              className='font-inter text-sm orange_gradient cursor-pointer'
              onClick={handleDelete}
            >
              Delete
            </p>
          </div>
        )}
      </div>

      {showFullPrompt && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeFullPrompt}>&times;</span>
            <div className="full-prompt-card">
              <div className="user-info">
                <Image
                  src={post.creator.image}
                  alt='user_image'
                  width={40}
                  height={40}
                  className='rounded-full object-contain'
                />
                <div className="user-details">
                  <h3 className="font-satoshi font-semibold text-gray-900">{post.creator.username}</h3>
                  <p className="font-inter text-sm text-gray-500">{post.creator.email}</p>
                </div>
                <div className='copy_btn' onClick={handleCopy}>
                  <Image
                    src={
                      copied === post.prompt
                        ? "/assets/icons/tick.svg"
                        : "/assets/icons/copy.svg"
                    }
                    alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
                    width={12}
                    height={12}
                  />
              </div>
              </div>
              <div className="prompt">
                <p className="font-satoshi text-sm text-gray-700">{post.prompt}</p>
              </div>
              <div className="tags">
                <p
                  className='font-inter text-sm blue_gradient cursor-pointer'
                  onClick={() => handleTagClick && handleTagClick(post.tag)}
                >
                  #{post.tag}
                </p>
              </div>
              {session?.user.id === post.creator._id && pathName === "/profile" && (
                <div className='mb-5 flex-center gap-4 border-t border-gray-100 pt-3'>
                  <p
                    className='font-inter text-sm green_gradient cursor-pointer'
                    onClick={handleEdit}
                  >
                    Edit
                  </p>
                  <p
                    className='font-inter text-sm orange_gradient cursor-pointer'
                    onClick={handleDelete}
                  >
                    Delete
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .expand_link {
          color: #EA5C0C;
          cursor: pointer;
          font-weight: bold;
          text-decoration: underline;
          display: inline-block;
        }

        .expand_link:hover {
          color: white;
        }

        .modal {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          overflow: auto;
        }

        .modal-content {
          background-color: #fefefe;
          padding: 20px;
          border: 1px solid #888;
          width: 80%;
          max-width: 600px;
          position: relative;
        }

        @media (max-width: 768px) {
          .modal-content {
            width: 90%;
            max-width: none;
          }
        }

        .close {
          color: #aaa;
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 28px;
          font-weight: bold;
          cursor: pointer;
        }

        .close:hover,
        .close:focus {
          color: black;
          text-decoration: none;
          cursor: pointer;
        }

        .full-prompt-card {
          padding: 20px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .prompt {
          margin-bottom: 20px;
        }

        .prompt_para{
          color: white
        }

        .tags {
          margin-bottom: 20px;
        }

        .prompt_card p,
        .prompt_card .expand_link {
          margin-bottom: 10px; /* Add margin between prompt text and tag or read more link */
        }
      `}</style>
    </>
  );
};

export default PromptCard;

// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./erc721.sol";

contract DeQuora is ERC721 {
    /**
     * @notice NFT铸造部分
     */

    //NFT相关状态变量
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _owners;
    mapping(uint256 => Answer) private NFT_answers;
    
    uint256 public NFT_id_generator = 0; // global unique answer id


    function balanceOf(
        address _owner
    ) public view override returns (uint256 _balance) {
        // 1. 在这里返回 `_owner` 拥有的NFT数
        return _balances[_owner];
    }

    function ownerOf(
        uint256 _tokenId
    ) public view override returns (address _owner) {
        // 2. 在这里返回 `_tokenId` 的所有者
        
    }

    function transfer(address _to, uint256 _tokenId) public override {}

    function approve(address _to, uint256 _tokenId) public override {}

    function takeOwnership(uint256 _tokenId) public override {}

    /**
     * @notice for code refactoring and upgrading by Joshua
     */
    // enum ItemKind {
    //     Question,
    //     Answer
    // }
    // struct Item {
    //     /// @notice what kind of item (post or comment)
    //     ItemKind kind;
    //     /// @notice Unique item id, assigned at creation time.
    //     uint256 id;
    //     /// @notice address of author.
    //     address author;
    //     /// @notice Id of parent item. Questions have parentId == 0.
    //     uint256 parentId;
    //     /// @notice block number when item was submitted
    //     uint256 createdAtBlock;
    //     /// @notice ids of all child items, with oldest items at front.
    //     uint256[] childIds;
    //     /// @notice IPFS CID o  f item content.
    //     string contentCID;
    // }

    /**
     * @notice 问答社区主体部分
     */

    struct User {
        uint256 id;
        address account;
        string name;
        uint256[] questions;
        uint256[] answered_questions;
        uint256[] answers;
        uint256 joined_on;
    }

    struct Question {
        uint256 id;
        string question;
        string author_name;
        address author_address;
        address owner_address;
        uint256 total_answers;
        uint256 likes;
        address[] liked_by;
        uint256 created_on;
        uint256 bonus_pool;
        address[] support_by;
        uint expire;
    }

    struct Answer {
        uint256 id;
        uint256 question_id;
        uint256 NFT_id;
        string answer;
        string author_name;
        address author_address;
        address owner_address;
        uint256 likes;
        address[] liked_by;
        uint256 created_on;
        uint256 bonus;
        address[] support_by;
        uint256 expire;
    }
    // useless code
    // struct QuestionAnswer {
    //     Question question;
    //     Answer[] answers;
    // }

    uint256 public total_users;
    uint256 public total_questions; // question count
    

    mapping(address => User) public users;
    mapping(uint256 => Answer[]) public answers; //question id to answers
    Question[] public questions; // all questions
    Answer[] answers_array;
    event new_user_added(User);
    event main_deployed(string);
    event question_added(Question);
    event answer_tipped(Answer);
    event question_tipped(Question);

    constructor() {
        total_users = 0;
        total_questions = 0;
        emit main_deployed("Main is deployed");
    }

    function create_user(
        string memory _name
    ) public payable returns (User memory) {
        require(bytes(_name).length != 0, "Username is required");
        User memory newUser = User(
            total_users,
            msg.sender,
            _name,
            new uint256[](0),
            new uint256[](0),
            new uint256[](0),
            block.timestamp
        );
        users[msg.sender] = newUser;
        total_users++;
        emit new_user_added(newUser);
        return newUser;
    }

    function get_user_details(
        address _user_address
    ) public view returns (User memory) {
        User memory user = users[_user_address];
        return user;
    }

    function add_question(
        string memory _question
    ) public payable returns (Question memory) {
        require(bytes(_question).length != 0, "Question cannot be empty");
        //创建Question实例
        Question memory newQuestion = Question(
            total_questions,
            _question,
            users[msg.sender].name,
            msg.sender,
            msg.sender,
            0,
            0,
            new address[](0),
            block.timestamp,
            0,
            new address[](0),
            block.timestamp + 30 days
        );
        //添加到questions数组中
        questions.push(newQuestion);
        total_questions++;
        //初始化对应Answer数组
        answers[newQuestion.id] = answers_array;
        //添加到用户提问列表中
        users[msg.sender].questions.push(newQuestion.id);

        emit question_added(newQuestion);

        return newQuestion;
    }

    function get_all_questions() public view returns (Question[] memory) {
        return questions;
    }

    function get_question(
        uint256 _question_id
    ) public view returns (Question memory, Answer[] memory, User memory) {
        Question memory question;

        //iterate over all the questions
        for (uint256 i = 0; i < total_questions; i++) {
            // check for the question with the given id
            if (questions[i].id == _question_id) {
                //return the question with the given id, and corresponding author
                question = questions[i];
                break;
            }
        }
        User memory _author = users[question.author_address];
        Answer[] memory _answers = answers[question.id];
        return (question, _answers, _author);
    }

    function set_question(
        Question memory _question,
        uint256 _question_id
    ) public {
        for (uint256 i = 0; i < total_questions; i++) {
            if (questions[i].id == _question_id) {
                questions[i] = _question;
                break;
            }
        }
    }

    function add_answer(
        uint256 _question_id,
        string memory _answer
    ) public payable returns (Answer memory) {
        require(bytes(_answer).length != 0, "Answer cannot be empty");
        (Question memory question, , ) = get_question(_question_id);
        require(
            question.author_address != msg.sender,
            "Author cannot answer his/her own question"
        );

        Answer memory answer = Answer(
            question.total_answers,
            _question_id,
            NFT_id_generator, // 添加NFT token
            _answer,
            users[msg.sender].name,
            msg.sender,
            msg.sender,
            0,
            new address[](0),
            block.timestamp,
            0,
            new address[](0),
            block.timestamp + 30 days
        );

        answers[_question_id].push(answer);
        question.total_answers++;

        users[msg.sender].answered_questions.push(_question_id);
        users[msg.sender].answers.push(answer.id);

        set_question(question, _question_id);

        //NFT部分
        NFT_answers[NFT_id_generator] = answer; // 将文章添加到NFT列表
        _owners[NFT_id_generator] = msg.sender; // 默认作者为拥有者
        _balances[msg.sender]++;
        NFT_id_generator++; //NFT token生成器++

        return answer;
    }

    function get_answer(
        uint256 _question_id,
        uint256 _answer_id
    ) public view returns (Answer memory) {
        //Get the question
        (Question memory question, , ) = get_question(_question_id);

        Answer memory answer;

        for (uint256 i = 0; i < question.total_answers; i++) {
            if (answers[_question_id][i].id == _answer_id) {
                answer = answers[_question_id][i];
            }
        }

        return answer;
    }

    function set_answer(
        uint256 _question_id,
        uint256 _answer_id,
        Answer memory _answer
    ) public returns (Question memory) {
        //Get the question
        (Question memory question, , ) = get_question(_question_id);

        for (uint256 i = 0; i < question.total_answers; i++) {
            if (answers[_question_id][i].id == _answer_id) {
                answers[_question_id][i] = _answer;
                break;
            }
        }
        return question;
    }

    function like_answer(
        uint256 _question_id,
        uint256 _answer_id,
        address _user_address
    ) public returns (Answer memory) {
        //获得Question
        (Question memory question, , ) = get_question(_question_id);
        //获得Answer
        Answer memory answer = get_answer(_question_id, _answer_id);
        //检查该用户是否已点过赞
        for (uint256 i = 0; i < answer.liked_by.length; i++) {
            require(
                answer.liked_by[i] != _user_address,
                "You have already liked this answer"
            );
        }
        //点赞
        answer.liked_by[answer.likes] = _user_address;
        answer.likes++;
        question.expire += 30 days;
        answer.expire += 30 days;
        //更新
        question = set_answer(_question_id, _answer_id, answer);
        set_question(question, _question_id);

        return answer;
    }

    function like_question(
        uint256 _question_id,
        address _user_address
    ) public returns (Question memory) {
        (Question memory question, , ) = get_question(_question_id);

        for (uint256 i = 0; i < question.liked_by.length; i++) {
            require(
                question.liked_by[i] != _user_address,
                "You have already liked this question"
            );
        }

        question.liked_by[question.likes] = _user_address;
        question.likes++;
        question.expire += 30 days;

        set_question(question, _question_id);

        return question;
    }

    /**
     * @notice 奖惩部分
     */

    // 对回答进行打赏
    function tip_answer(
        uint256 _question_id,
        uint256 _answer_id
    ) public payable {
        // 找到对应回答
        //获得Question
        (Question memory question, , ) = get_question(_question_id);
        //获得Answer
        Answer memory answer = get_answer(_question_id, _answer_id);
        // 找到作者
        address payable _author = payable(answer.author_address);
        // 支付燃料费
        _author.transfer(msg.value);
        answer.bonus += msg.value; 
        question.expire += 30 days;
        answer.expire += 30 days;
        //更新
        question = set_answer(_question_id, _answer_id, answer);
        set_question(question, _question_id);
        // 调用事件
        emit answer_tipped(answer);
    }

    // 对问题进行打赏
    function tip_question(uint256 _question_id) public payable {
        (Question memory question, , ) = get_question(_question_id);

        emit question_tipped(question);
    }

    function clean() private {
        for (uint256 i = 0; i < total_questions; i++) {
            Question memory q = questions[i];
            if (q.expire < block.timestamp) {
                //将最后一个问题放到过期问题的位置
                questions[i] = questions[total_questions - 1];
                total_questions--;
            }
        }
    }
}

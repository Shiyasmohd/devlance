// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract DevLance {
    struct Freelancer {
        uint256 id;
        address payable wallet;
        string name;
        string[] skills;
        uint256[] gigs;
    }

    struct Seller {
        uint256 id;
        address payable wallet;
        string name;
    }

    struct Gig {
        uint256 id;
        uint256 freelancerId;
        uint256 price;
        string title;
        string description;
    }

    struct Order {
        uint256 id;
        uint256 gigId;
        uint256 sellerId;
        string instruction;
        uint256 price;
        bool isAccepted;
        bool isCompleted;
        string submission;
        bool isPaid;
    }

    uint256 public freelancerCount; //Total number of Freelancers
    uint256 public sellerCount; //Total number of Sellers
    uint256 public gigCount; //Total number of Gigs
    uint256 public orderCount; //Total number of Orders

    mapping(uint256 => Freelancer) public freelancers; //Maps freelancerID to details of Freelancer
    mapping(uint256 => Seller) public sellers; //Maps SellerID to details of Seller
    mapping(uint256 => Gig) public gigs; //Maps GigID to details of Gig
    mapping(uint256 => Order) public orders; //Maps OrderID to details of Order

    event FreelancerRegistered(
        uint256 id,
        address wallet,
        string name,
        string[] skills
    );

    event SellerRegistered(uint256 id, address wallet, string name);

    event GigCreated(
        uint256 id,
        uint256 freelancerId,
        uint256 price,
        string title,
        string description
    );

    event OrderCreated(
        uint256 id,
        uint256 gigId,
        string instruction,
        uint256 price
    );

    event OrderAccepted(uint256 id);

    event OrderSubmitted(uint256 id, string submission);

    event PaymentTransferred(
        uint256 orderId,
        address indexed sellerWallet,
        address indexed freelancerWallet,
        uint256 amount
    );

    function registerFreelancer(
        string memory _name,
        string[] memory _skills
    ) external {
        require(bytes(_name).length > 0, "Name must not be empty");
        require(_skills.length > 0, "Skills must not be empty");

        freelancerCount++;
        Freelancer memory newFreelancer;
        newFreelancer.id = freelancerCount;
        newFreelancer.wallet = payable(msg.sender);
        newFreelancer.name = _name;
        newFreelancer.skills = _skills;

        freelancers[freelancerCount] = newFreelancer;

        emit FreelancerRegistered(freelancerCount, msg.sender, _name, _skills);
    }

    function registerSeller(string memory _name) external {
        require(bytes(_name).length > 0, "Name must not be empty");

        sellerCount++;
        sellers[sellerCount] = Seller({
            id: sellerCount,
            wallet: payable(msg.sender),
            name: _name
        });

        emit SellerRegistered(sellerCount, msg.sender, _name);
    }

    function createGig(
        uint256 _freelancerId,
        uint256 _price,
        string memory _title,
        string memory _description
    ) external {
        require(
            _freelancerId > 0 && _freelancerId <= freelancerCount,
            "Invalid freelancer ID"
        );

        Freelancer storage freelancer = freelancers[_freelancerId];
        require(
            freelancer.wallet == msg.sender,
            "Only the assigned freelancer can create a gig"
        );
        require(_price > 0, "Price must be greater than 0");
        require(bytes(_title).length > 0, "Title must not be empty");
        require(
            bytes(_description).length > 0,
            "Description must not be empty"
        );

        gigCount++;
        gigs[gigCount] = Gig({
            id: gigCount,
            freelancerId: _freelancerId,
            price: _price,
            title: _title,
            description: _description
        });

        freelancer.gigs.push(gigCount);

        emit GigCreated(gigCount, _freelancerId, _price, _title, _description);
    }

    function createOrder(
        uint256 _gigId,
        string memory _instruction,
        uint256 _price,
        uint256 _sellerId
    ) external {
        require(_gigId > 0 && _gigId <= gigCount, "Invalid Gig ID");
        require(
            bytes(_instruction).length > 0,
            "Description must not be empty"
        );
        require(_price > 0, "Price must be greater than 0");

        orderCount++;
        Order memory newOrder;
        newOrder.id = orderCount;
        newOrder.gigId = _gigId;
        newOrder.instruction = _instruction;
        newOrder.price = _price;
        newOrder.isAccepted = false;
        newOrder.sellerId = _sellerId;

        orders[orderCount] = newOrder;

        emit OrderCreated(orderCount, _gigId, _instruction, _price);
    }

    function acceptOrder(uint256 _orderId) external {
        require(_orderId > 0 && _orderId <= orderCount, "Invalid Gig ID");

        require(
            orders[_orderId].isAccepted == false,
            "Order is already accepted"
        );
        orders[_orderId].isAccepted = true;

        emit OrderAccepted(_orderId);
    }

    function submitOrder(uint256 _orderId, string memory _submission) external {
        require(_orderId > 0 && _orderId <= orderCount, "Invalid Gig ID");

        require(
            orders[_orderId].isCompleted == false,
            "Order is already submitted"
        );
        orders[_orderId].isCompleted = true;
        orders[_orderId].submission = _submission;

        emit OrderSubmitted(_orderId, _submission);
    }

    function transferPayment(uint256 _orderId) external payable {
        Order storage contextOrder = orders[_orderId];
        require(contextOrder.id == _orderId, "Gig does not exist");
        require(msg.value > contextOrder.price, "Incorrect payment amount");

        Freelancer storage freelancer = freelancers[
            gigs[contextOrder.gigId].freelancerId
        ];
        (bool success, ) = freelancer.wallet.call{value: msg.value}("");
        require(success, "Payment transfer failed");
        orders[_orderId].isPaid = true;

        emit PaymentTransferred(
            _orderId,
            msg.sender,
            freelancer.wallet,
            msg.value
        );
    }

    function getFreelancerByWallet(
        address _wallet
    ) external view returns (Freelancer memory) {
        require(_wallet != address(0), "Address can't be null");
        for (uint256 i = 1; i <= freelancerCount; i++) {
            if (freelancers[i].wallet == payable(_wallet)) {
                return freelancers[i];
            }
        }
        Freelancer memory emptyFreelancer;
        return emptyFreelancer;
    }

    function getSellerByWallet(
        address _wallet
    ) external view returns (Seller memory) {
        require(_wallet != address(0), "Address can't be null");
        for (uint256 i = 1; i <= sellerCount; i++) {
            if (sellers[i].wallet == payable(_wallet)) {
                return sellers[i];
            }
        }
        Seller memory emptySeller;
        return emptySeller;
    }

    function getAllGigs() public view returns (Gig[] memory) {
        Gig[] memory result = new Gig[](gigCount);

        for (uint256 i = 1; i <= gigCount; i++) {
            result[i - 1] = gigs[i];
        }

        return result;
    }

    function getGigsByFreelancer(
        uint256 freelancerId
    ) public view returns (Gig[] memory) {
        uint256 count = 0;

        // Count the number of gigs with the given freelancerId
        for (uint256 i = 1; i <= gigCount; i++) {
            if (gigs[i].freelancerId == freelancerId) {
                count++;
            }
        }

        // Create an array to store the gigs with the given freelancerId
        Gig[] memory result = new Gig[](count);

        // Populate the result array
        uint256 resultIndex = 0;
        for (uint256 i = 1; i <= gigCount; i++) {
            if (gigs[i].freelancerId == freelancerId) {
                result[resultIndex] = gigs[i];
                resultIndex++;
            }
        }

        return result;
    }

    function getOrdersByGigId(
        uint256 targetGigId
    ) public view returns (Order[] memory) {
        uint256 totalOrders = orderCount;
        uint256 count = 0;

        // Count the number of orders with the given gigId
        for (uint256 i = 1; i <= totalOrders; i++) {
            if (orders[i].gigId == targetGigId) {
                count++;
            }
        }

        // Create an array to store the orders with the given gigId
        Order[] memory result = new Order[](count);

        // Populate the result array
        uint256 resultIndex = 0;
        for (uint256 i = 1; i <= totalOrders; i++) {
            if (orders[i].gigId == targetGigId) {
                result[resultIndex] = orders[i];
                resultIndex++;
            }
        }

        return result;
    }
}

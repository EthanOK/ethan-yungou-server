const SortType = {
  RecentlyTransferred: "RecentlyTransferred",
  RecentlyCreated: "RecentlyCreated",
  PriceLowToHigh: "PriceLowToHigh",
  PriceHighToLow: "PriceHighToLow",
  RarityRank: "RarityRank",
};

const getCollectionSlugByAddress = async (address) => {
  let requestParameters = {
    operationName: "SearchCollectionList",
    variables: {
      querystring: address,
      blockChain: {
        chain: "eth",
        chainId: "0x1",
      },
      limit: 4,
      isExplore: false,
      isTop: true,
    },
    query:
      "query SearchCollectionList($querystring: String, $blockChain: BlockChainInput, $limit: Int, $isTop: Boolean!, $isExplore: Boolean!) {\n  collectionMatch(\n    input: {querystring: $querystring, blockChain: $blockChain, limit: $limit}\n  ) {\n    name\n    imageUrl\n    slug\n    isVerified\n    description @include(if: $isExplore)\n    featuredImageUrl @include(if: $isExplore)\n    bannerImageUrl @include(if: $isExplore)\n    stats(realtime: true) @include(if: $isTop) {\n      assetCount\n      collectionFloorPrice {\n        floorPriceSource\n        coin {\n          name\n          address\n          icon\n          chainId\n          chain\n        }\n      }\n    }\n    contracts {\n      blockChain {\n        chain\n        chainId\n      }\n    }\n  }\n}\n",
  };

  try {
    let result = await fetch(
      `https://api.element.market/graphql?args=SearchCollectionList`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": "zQbYj7RhC1VHIBdWU63ki5AJKXloamDT",
          "X-Api-Sign":
            "39e872910b620a39e83a7d952e17b6775bb752ae8631c1b03482e52b1f46e667.6801.1706753791",
        },

        body: JSON.stringify(requestParameters),
      }
    );
    let result_json = await result.json();
    let collectionMatch = result_json.data.collectionMatch;
    if (collectionMatch == null) return null;

    const data = {
      name: collectionMatch[0].name,
      slug: collectionMatch[0].slug,
      assetCount: collectionMatch[0].stats.assetCount,
      address: address,
    };

    console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
};

const getAssetsListBySlug = async (slug, sortType, tokenId) => {
  let requestParameters = {
    operationName: "AssetsListForCollection",
    variables: {
      realtime: true,
      thirdStandards: [],
      collectionSlugs: [slug],
      sortAscending: "false",
      sortBy: sortType,
      first: 50,
      isPendingTx: true,
      isTraits: false,
      isSupply: false,
      noPending: true,
    },
    query:
      "query AssetsListForCollection($before: String, $after: String, $first: Int, $last: Int, $querystring: String, $categorySlugs: [String!], $collectionSlugs: [String!], $sortBy: SearchSortBy, $sortAscending: Boolean, $toggles: [SearchToggle!], $ownerAddress: Address, $creatorAddress: Address, $blockChains: [BlockChainInput!], $paymentTokens: [String!], $priceFilter: PriceFilterInput, $traitFilters: [AssetTraitFilterInput!], $contractAliases: [String!], $thirdStandards: [String!], $uiFlag: SearchUIFlag, $markets: [String!], $isTraits: Boolean!, $isPendingTx: Boolean!, $noPending: Boolean, $isSupply: Boolean!) {\n  search(\n    \n    before: $before\n    after: $after\n    first: $first\n    last: $last\n    search: {querystring: $querystring, categorySlugs: $categorySlugs, collectionSlugs: $collectionSlugs, sortBy: $sortBy, sortAscending: $sortAscending, toggles: $toggles, ownerAddress: $ownerAddress, creatorAddress: $creatorAddress, blockChains: $blockChains, paymentTokens: $paymentTokens, priceFilter: $priceFilter, traitFilters: $traitFilters, contractAliases: $contractAliases, uiFlag: $uiFlag, markets: $markets, noPending: $noPending}\n  ) {\n    totalCount\n    edges {\n      cursor\n      node {\n        asset {\n          chain\n          chainId\n          contractAddress\n          tokenId\n          tokenType\n          name\n          imagePreviewUrl\n          animationUrl\n          rarityRank\n          assetOwners(first: 1) {\n            ...AssetOwnersEdges\n          }\n          orderData(standards: $thirdStandards) {\n            bestAsk {\n              ...BasicOrder\n            }\n            bestBid {\n              ...BasicOrder\n            }\n          }\n          assetEventData {\n            lastSale {\n              lastSalePrice\n              lastSalePriceUSD\n              lastSaleTokenContract {\n                name\n                address\n                icon\n                decimal\n                accuracy\n              }\n            }\n          }\n          pendingTx @include(if: $isPendingTx) {\n            time\n            hash\n            gasFeeMax\n            gasFeePrio\n            txFrom\n            txTo\n            market\n          }\n          traits @include(if: $isTraits) {\n            trait\n            numValue\n          }\n          collection {\n            slug\n            rarityEnable\n            categories {\n              slug\n            }\n          }\n          suspiciousStatus\n          uri\n          supply @include(if: $isSupply)\n        }\n      }\n    }\n    pageInfo {\n      hasPreviousPage\n      hasNextPage\n      startCursor\n      endCursor\n    }\n  }\n}\n\nfragment BasicOrder on OrderV3Type {\n  __typename\n  orderId\n  chain\n  chainId\n  chainMId\n  expirationTime\n  listingTime\n  maker\n  taker\n  side\n  saleKind\n  paymentToken\n  quantity\n  priceBase\n  priceUSD\n  price\n  standard\n  contractAddress\n  tokenId\n  schema\n  extra\n  paymentTokenCoin {\n    name\n    address\n    icon\n    chain\n    chainId\n    decimal\n    accuracy\n  }\n}\n\nfragment AssetOwnersEdges on AssetOwnershipTypeConnection {\n  __typename\n  edges {\n    cursor\n    node {\n      chain\n      chainId\n      owner\n      balance\n      account {\n        identity {\n          address\n          blockChain {\n            chain\n            chainId\n          }\n        }\n        user {\n          id\n          address\n          profileImageUrl\n          userName\n        }\n        info {\n          profileImageUrl\n          userName\n        }\n      }\n    }\n  }\n}\n",
  };

  if (tokenId != null) {
    requestParameters.variables.querystring = tokenId;
  }

  try {
    let result = await fetch(
      `https://api.element.market/graphql?args=SearchCollectionList`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": "zQbYj7RhC1VHIBdWU63ki5AJKXloamDT",
          "X-Api-Sign":
            "39e872910b620a39e83a7d952e17b6775bb752ae8631c1b03482e52b1f46e667.6801.1706753791",
        },

        body: JSON.stringify(requestParameters),
      }
    );
    let result_json = await result.json();

    const data = result_json.data;

    console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
};

const getAssetsListByAddress = async (address, sortType, tokenId) => {
  const collectionData = await getCollectionSlugByAddress(address);

  const slug = collectionData.slug;

  await getAssetsListBySlug(slug, sortType, tokenId);
};

getAssetsListByAddress(
  "0x1b489201d974d37ddd2faf6756106a7651914a63",
  SortType.RecentlyTransferred,
  1000
);

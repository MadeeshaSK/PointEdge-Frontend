import { HStack, Image, Text, Tooltip } from "@chakra-ui/react";
import productImage from "../../../assets/product-image.png";
import { ProductOrderQuantity } from "../../../hooks/useProductOrderQuantities";
import { getProductImageUrl } from "../../../services/apiClient";
import priceFormatter from "../../../utils/priceFormatter";
import ProductListText from "./ProductListText";

interface Props {
  data: ProductOrderQuantity;
}

const ProductCard = ({ data }: Props) => {
  return (
    <Tooltip label={data.productName} color="black" bgColor="lightGray">
      <HStack
        bgColor="white"
        border="2px"
        borderColor="gray"
        borderRadius={8}
        padding={2}
        width="full"
        cursor={"pointer"}
        _hover={{ borderColor: "lightBlue" }}
      >
        <Image
          src={
            data.imageName ? getProductImageUrl(data.imageName) : productImage
          }
          boxSize={{ base: 8, md: 10 }}
          aspectRatio={1}
          objectFit="contain"
        />
        <Text width="full" noOfLines={2} fontSize={{ base: 12, md: 16 }}>
          {data.productName}
        </Text>
        <ProductListText value={data.totalQuantity} fontWeight="bold" />
        <ProductListText value={priceFormatter(data.pricePerUnit)} />
        <ProductListText
          value={priceFormatter(data.totalQuantity * data.pricePerUnit)}
          fontWeight="bold"
        />
      </HStack>
    </Tooltip>
  );
};

export default ProductCard;

import Skeleton from "@mui/material/Skeleton";

const SkeletonCard = () => {
  return (
    <div className="my-10 font-satoshi text-center program_layout">
      <Skeleton variant="rectangular" width={250} height={230} />
      <Skeleton variant="rectangular" width={250} height={230} />
      <Skeleton variant="rectangular" width={250} height={230} />
      <Skeleton variant="rectangular" width={250} height={230} />
      <Skeleton variant="rectangular" width={250} height={230} />
      <Skeleton variant="rectangular" width={250} height={230} />
      <Skeleton variant="rectangular" width={250} height={230} />
      <Skeleton variant="rectangular" width={250} height={230} />
    </div>
  );
};

export default SkeletonCard;

import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductListing1 from '../../ProductListing/ProductListing1';
import { useGetProductsByFilterCategoryValueMutation } from '../../../../redux/Apis/ProductApi';
import { useGetFactoryProductsByIdMutation } from '../../../../redux/Apis/FactoryApi'; // <-- Import your factory API hook
import { Skeleton, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const CategoryPages = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const type = params.get('type');
  const id = params.get('id');
  const strict = params.get('strict') === 'true';
  const ref = useRef(null);
  const skeletonArray = Array.from({ length: 2 });
  console.log('type',type)
  // Pagination state
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  // API hooks
  const [getProducts, { isLoading }] = useGetProductsByFilterCategoryValueMutation();
  const [getFactory,{ data: factoryData, isLoading: factoryLoading }] = useGetFactoryProductsByIdMutation();

  // Fetch products on mount and when page/type/id changes
  useEffect(() => {
    if (!id || !type) return;
    if (type === 'factory') {
      // If factory, you may want to fetch products by factory id (adjust API as needed)
      getFactory({ id: id, page, limit: 10 })
        .unwrap()
        .then(res => {
          if (page === 1) {
            setProducts(res?.data?.products || []);
          } else {
            setProducts(prev => [...prev, ...(res.data || [])]);
          }
          setHasMore((res.data?.length || 0) === 10);
        });
    } else {
      getProducts({ filterCategoryId: id, value: type, strict: strict, page, limit: 10 })
        .unwrap()
        .then(res => {
          if (page === 1) {
            setProducts(res.data || []);
          } else {
            setProducts(prev => [...prev, ...(res.data || [])]);
          }
          setHasMore((res.data?.length || 0) === 10);
        });
    }
    // eslint-disable-next-line
  }, [id, type, page]);

  // Infinite scroll handler
  const handleScroll = () => {
    if (!hasMore || isLoading) return;
    if (
      ref.current.clientHeight + ref.current.scrollTop >= ref.current.scrollHeight - 200
    ) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (ref.current) {
        ref.current.removeEventListener('scroll', handleScroll);
      }
    }
  }, [handleScroll, ref]);

  // Reset products when type/id changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [type, id]);

  // Format type for heading (remove commas, capitalize)
  const getHeading = () => {
    if (type === 'factory') {
      if (factoryLoading) return 'Loading...';
      return factoryData?.data?.factory?.name || 'Factory Products';
    }
    if (!type) return '';
    return type
      .split(',')
      .map(str => str.trim().charAt(0).toUpperCase() + str.trim().slice(1))
      .join(', ');
  };

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'flex-start', height: '100%', overflowY: 'auto' }}>
      {/* Header with back button and heading */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px 0 8px', background: '#fff', position: 'sticky', top: 0, zIndex: 10 }}>
        <IconButton  onClick={() =>{
                            console.log(window.history);
                            if (window.history.length > 2) {
                            navigate(-1);
                        } else {
                            navigate('/');
                        }}}size="small" style={{ marginRight: 8 }}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.2em', flex: 1 }}>{getHeading()}</h2>
      </div>
      <ProductListing1 loading={isLoading && page === 1} data={products} ref={null} />
      {isLoading && page > 1 && (
        <div className="product-listing-grid" >
         {skeletonArray.map((_, idx) => (
        <div key={idx}  className="product-card">
          <Skeleton variant="rectangular" width="100%" height={120} className="product-image" style={{ borderRadius: 12 }} />
          <div className="product-details">
            <Skeleton variant="text" width="70%" height={24} className="product-title" style={{ margin: '8px 0 0 0' }} />
            <Skeleton variant="text" width="90%" height={18} className="product-desc-home" style={{ margin: '6px 0 0 0' }} />
            <Skeleton variant="text" width="40%" height={16} className="product-size" style={{ margin: '8px 0 0 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 8, justifyContent: 'space-between', width: '100%' }}>
              <Skeleton variant="text" width={60} height={20} />
              <Skeleton variant="rectangular" width={60} height={28} style={{ borderRadius: 6 }} />
            </div>
          </div>
        </div>))}
        </div>
      )}
      {!hasMore && !isLoading && products.length === 0 && (
        <div style={{ textAlign: 'center' }}>No products found.</div>
      )}
    </div>
  );
};

export default CategoryPages;

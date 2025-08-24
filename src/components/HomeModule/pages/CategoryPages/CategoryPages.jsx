import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ProductListing1 from '../../ProductListing/ProductListing1';
import { useGetProductsByFilterCategoryValueMutation } from '../../../../redux/Apis/ProductApi';
import { Skeleton } from '@mui/material';

const CategoryPages = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const type = params.get('type');
  const id = params.get('id');
  const strict = params.get('strict') === 'true';
  const ref = useRef(null)
  console.log('Type:', type, 'ID:', id);
const skeletonArray = Array.from({ length: 2 });
  // Pagination state
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  // API hook
  const [getProducts, { data, isLoading }] = useGetProductsByFilterCategoryValueMutation();

  // Fetch products on mount and when page/type/id changes
  useEffect(() => {
    if (!id || !type) return;
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
    // eslint-disable-next-line
  }, [id, type, page]);

  console.log('Products:', products);

  // Infinite scroll handler
  const handleScroll = () => {
    if (!hasMore || isLoading) return;
    console.log('running')
    console.log('Scroll event triggered', ref.current.clientHeight, ref.current.scrollTop, ref.current.scrollHeight);
    if (

      ref.current.clientHeight + ref.current.scrollTop >= ref.current.scrollHeight - 200
    ) {

      setPage(prev => prev + 1);
    }
  };





  // useEffect(() => {
  //   console.log('ref', ref)
  //   if (ref.current) {
  //     console.log('ref.current', ref.current.innerHeight, ref.current.scrollTop, ref.current.scrollHeight);
  //     if (ref.current.innerHeight + ref.current.scrollTop >= ref.current.scrollHeight - 200) {
  //       setPage(prev => prev + 1);
  //     }
  //   }
  // }, [ref])

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

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'flex-start', height: '100%', overflowY: 'auto' }}>
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

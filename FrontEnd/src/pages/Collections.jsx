import React, { useEffect, useState, useContext } from 'react';
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import Title from '../components/Title.jsx';
import ShopDataContext from '../context/ShopDataContext.jsx';
import Card from '../components/Card.jsx';

function Collections() {
  const [showFilter, setShowFilter] = useState(false);
  const { products, search, showSearch } = useContext(ShopDataContext);

  const [filterProduct, setFilterProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  // Toggle for category checkbox
  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  // Toggle for sub-category checkbox
  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  // Main filtering logic
  const applyFilter = () => {
    let filtered = [...products];

    if (showSearch && search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      filtered = filtered.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      filtered = filtered.filter(item => subCategory.includes(item.subCategory));
    }

    if (sortType === "low-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilterProduct(filtered);
  };

  useEffect(() => {
    setFilterProduct(products);
  }, [products]);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, sortType, search, showSearch]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] flex flex-col md:flex-row pt-[70px] overflow-x-hidden z-[2] pb-[100px]">

      {/* Sidebar */}
      <div className="w-full md:w-[30%] lg:w-[17%] p-5 border-r border-gray-400 text-[#aaf5fa]">

        {/* FILTERS Header */}
        <p
          className="text-[25px] font-semibold flex gap-2 items-center cursor-pointer md:cursor-default md:gap-0 md:justify-start"
          onClick={() => setShowFilter(prev => !prev)}
        >
          FILTERS
          <span className="md:hidden">
            {!showFilter ? <FaChevronRight /> : <FaChevronDown />}
          </span>
        </p>

        {/* Filters */}
        <div className={`${showFilter ? "block" : "hidden"} md:block`}>
          {/* Categories */}
          <div className="border-2 border-[#dedcdc] pl-5 py-3 mt-4 rounded-md bg-slate-600">
            <p className="text-lg text-[#f8fafa]">CATEGORIES</p>
            <div className="flex flex-col gap-2 mt-2">
              {["Men", "Women", "Kids"].map(cat => (
                <label key={cat} className="flex gap-2 items-center text-[16px] font-light">
                  <input
                    type="checkbox"
                    value={cat}
                    className="w-3"
                    checked={category.includes(cat)}
                    onChange={toggleCategory}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* Sub-Categories */}
          <div className="border-2 border-[#dedcdc] pl-5 py-3 mt-4 rounded-md bg-slate-600">
            <p className="text-lg text-[#f8fafa]">SUB-CATEGORIES</p>
            <div className="flex flex-col gap-2 mt-2">
              {["TopWear", "BottomWear", "WinterWear"].map(sub => (
                <label key={sub} className="flex gap-2 items-center text-[16px] font-light">
                  <input
                    type="checkbox"
                    value={sub}
                    className="w-3"
                    checked={subCategory.includes(sub)}
                    onChange={toggleSubCategory}
                  />
                  {sub}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-[70%] lg:w-[80%] p-5">
        <div className="flex flex-col lg:flex-row justify-between lg:px-10">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />

          <select
            className="bg-slate-600 w-full md:w-[200px] h-[50px] px-3 text-white rounded-lg hover:border-[#46d1f7] border-2 mt-4 lg:mt-0"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="relevant">Sort By: Relevant</option>
            <option value="low-high">Sort By: Low-High</option>
            <option value="high-low">Sort By: High-Low</option>
          </select>
        </div>

        <div className='lg:w-[80vw] md:w-[60vw] w-[100vw] min-h-[70vh] flex items-center justify-center flex-wrap gap-[30px] mt-4'>
          {
            filterProduct.length > 0 ? (
              filterProduct.map((item, index) => (
                <Card
                  key={index}
                  id={item._id}
                  name={item.name}
                  price={item.price}
                  image={item.image1}
                />
              ))
            ) : (
              <p className="text-white text-xl mt-10">No products found matching your filters.</p>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default Collections;
